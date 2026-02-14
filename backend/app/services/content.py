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
