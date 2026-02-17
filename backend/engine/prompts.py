import json

def generate_review_prompt(product_name: str, affiliate_link: str) -> str:
    """
    Generates a prompt for NotebookLM to creating a product review.
    """
    return f"""
You are an expert affiliate marketer and product reviewer.
Please write a comprehensive, honest, and high-converting product review for "{product_name}".

You MUST use the information available in the notebook to answer.

Structure the review as a valid JSON object with the following fields:
- "title": A catchy title for the review (e.g., "{product_name} Review: Is it Worth It?").
- "seo_description": A meta description optimized for SEO (max 160 chars).
- "pros": A list of strings detailing the pros.
- "cons": A list of strings detailing the cons.
- "verdict": A short summary paragraph of the final verdict.
- "body": The main content of the review in Markdown format.
    - Include a "Features" section.
    - Include a "Pricing" section.
    - Include a "Who is this for?" section.
    - DO NOT include the title or valid Frontmatter in this "body" field, just the headings and text.

CRITICAL REQUIREMENTS:
1.  **FTC Disclosure**: The output MUST be compliant. I will add the disclosure programmatically, but ensure the tone is honest.
2.  **Affiliate Link**: Use this link EXACTLY for any Call-to-Action (CTA): {affiliate_link}
    - Ensure the link is used at least 3 times in the body.
3.  **Tone**: Professional, authoritative, yet accessible.
    """
