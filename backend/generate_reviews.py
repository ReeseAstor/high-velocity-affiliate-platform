import asyncio
import argparse
import os
import sys
import json
import frontmatter
from datetime import datetime
from engine.client import NotebookLMClient
from engine.prompts import generate_review_prompt

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../frontend/app/content/reviews")

async def main():
    parser = argparse.ArgumentParser(description="Generate Affiliate Product Review")
    parser.add_argument("--product", required=True, help="Name of the product to review")
    parser.add_argument("--link", required=True, help="Affiliate link for the product")
    parser.add_argument("--notebook", default="Master Affiliate", help="Name of the notebook to query")
    args = parser.parse_args()

    print(f"Starting review generation for: {args.product} using notebook: '{args.notebook}'")
    
    # Initialize Client
    client = NotebookLMClient()
    try:
        await client.connect()
        print("Connected to NotebookLM MCP.")
        
        # Construct Prompt
        prompt = generate_review_prompt(args.product, args.link)
        
        print(f"Sending prompt to notebook '{args.notebook}'...")
        
        # Execute
        result = await client.query_notebook(args.notebook, prompt)
        
        if not result or not result.content:
            print("Error: No content returned from NotebookLM.")
            return

        content_text = result.content[0].text
        
        # Clean up code blocks if present ( ```json ... ``` )
        clean_text = content_text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text[7:]
        if clean_text.startswith("```"):
            clean_text = clean_text[3:]
        if clean_text.endswith("```"):
            clean_text = clean_text[:-3]
        
        try:
            data = json.loads(clean_text)
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON response: {e}")
            print("Raw output:", content_text)
            return

        # Create Markdown with Frontmatter
        post = frontmatter.Post(
            content=data.get("body", ""),
            **{
                "title": data.get("title", f"{args.product} Review"),
                "date": datetime.now().strftime("%Y-%m-%d"),
                "description": data.get("seo_description", ""),
                "pros": data.get("pros", []),
                "cons": data.get("cons", []),
                "verdict": data.get("verdict", ""),
                "product_name": args.product,
                "affiliate_link": args.link,
                "is_sponsored": True
            }
        )

        # Ensure Output Directory
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        # Filename slug
        slug = args.product.lower().replace(" ", "-").replace("'", "").replace('"', "")
        filepath = os.path.join(OUTPUT_DIR, f"{slug}.md")
        
        # Write File
        with open(filepath, "wb") as f:
            frontmatter.dump(post, f)
            
        print(f"Review generated successfully: {filepath}")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(main())
