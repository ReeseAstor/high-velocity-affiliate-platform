from openai import AsyncOpenAI
import os
from ..schemas import ProductCreate

client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

async def generate_product_review(product: ProductCreate) -> dict:
    prompt = f"""
    Write a comprehensive product review for the following product:
    Name: {product.name}
    Description: {product.description}
    Metadata: {product.metadata}

    The review should include:
    1. Introduction
    2. Key Features
    3. Pros and Cons
    4. Conclusion with a call to action.

    Format the output in Markdown.
    """

    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo", # Or gpt-4o if available/preferred
            messages=[
                {"role": "system", "content": "You are an expert affiliate marketer writing high-converting product reviews."},
                {"role": "user", "content": prompt}
            ]
        )
        content = response.choices[0].message.content
        return {
            "title": f"Review: {product.name}",
            "slug": product.name.lower().replace(" ", "-"), # Simple slug generation, should actully be more robust
            "body_markdown": content,
            "meta_description": f"Read our in-depth review of {product.name}. Find out if it's right for you.",
            "status": "draft"
        }
    except Exception as e:
        print(f"Error generating content: {e}")
        return None

async def generate_comparison(product_a_name: str, product_b_name: str, extra_info: str = "") -> dict:
    prompt = f"""
    You are an expert affiliate marketer and product reviewer.
    Generate a detailed comparison between two products:
    Product A: {product_a_name}
    Product B: {product_b_name}
    Extra Info: {extra_info}

    Output the result as valid JSON matching this schema:
    {{
        "slug": "product-a-vs-product-b",
        "title": "Product A vs Product B: Detailed Comparison in 2025",
        "subtitle": "Discover which is the best choice for you.",
        "meta_description": "A comprehensive comparison between Product A and Product B...",
        "product_a": {{
            "name": "Product A exact name",
            "rating": 9.5,
            "brand_color": "from-blue-600 to-blue-400",
            "logo_url": "https://placehold.co/100x40/blue/white?text=A",
            "features": ["feature 1", "feature 2"],
            "overview": "Short 2-3 sentence overview...",
            "strengths": ["pro 1", "pro 2"],
            "weaknesses": ["con 1", "con 2"],
            "best_for": "Who is this best for",
            "affiliate_url": "",
            "display_price": "$9.99/mo"
        }},
        "product_b": {{
            "name": "Product B exact name",
            "rating": 9.0,
            "brand_color": "from-purple-600 to-purple-400",
            "logo_url": "https://placehold.co/100x40/purple/white?text=B",
            "features": ["feature 1", "feature 2"],
            "overview": "Short 2-3 sentence overview...",
            "strengths": ["pro 1", "pro 2"],
            "weaknesses": ["con 1", "con 2"],
            "best_for": "Who is this best for",
            "affiliate_url": "",
            "display_price": "$8.99/mo"
        }},
        "winner": "A", // or "B"
        "winner_reason": "Short reason why A won",
        "categories": [
            {{
                "name": "Performance",
                "product_a_value": "Excellent",
                "product_b_value": "Good",
                "winner": "A", // or "B" or "Tie"
                "explanation": "Why A wins in performance..."
            }}
            // Generate 4-5 categories (e.g. Design, Value, Features, Support)
        ],
        "faqs": [
            {{
                "q": "Which is better overall?",
                "a": "Answer here..."
            }}
            // 2-3 FAQs
        ],
        "verdict_summary": "Overall summary paragraph..."
    }}
    Do not wrap in markdown tags like ```json. Return exactly valid JSON.
    """

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini", # Or preferred capable model
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are a specialized JSON comparison generator."},
                {"role": "user", "content": prompt}
            ]
        )
        import json
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        import traceback
        print(f"Error generating comparison: {{e}}")
        traceback.print_exc()
        return None
