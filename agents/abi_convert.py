import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def run(data_package: dict) -> dict:
    print("\n[Abi Convert] Analysing data and generating structured slide metrics with charting contracts...")
    
    system_prompt = """You are Abi Convert, an elite executive business analyst.
Your job is to analyze the raw input data package and transform it into a highly detailed presentation layout tailored strictly to the user's explicit request.

You must return ONLY a valid JSON structure with absolutely no markdown wrappers, no ```json formatting, and no conversational explanation text.

CRITICAL PRESENTATION STRUCTURE:
1. The VERY FIRST slide in the "slides" array MUST be a dedicated cover page layout. It must have "type": "cover_page", a clear presentation title, a subtitle, and no visual_element graphs.

CRITICAL FINANCIAL & DATA RULES:
1. All monetary values must be calculated and displayed strictly in South African Rands using the prefix 'R' (e.g., R105,303.53). Treat the raw transactional column numbers directly as Rands as requested by the user. Do not use dollar signs ($).
2. STRCITLY USE THE REAL DATA: Look at the actual 'City' names (such as Yangon, Naypyitaw, Mandalay) and 'Product line' categories present in the data package. NEVER invent regions like 'Gauteng', 'Western Cape', or items like 'Software License'. If the passed data package contains those words, ignore them and fall back strictly to the underlying spreadsheet matrices.

Expected JSON Structure:
{
  "title": "A highly precise title addressing the user prompt",
  "key_insights": [
    "Granular trend observation 1 showing exact revenue metrics in Rands using the real cities/products from the data",
    "Granular trend observation 2 formatted in Rands using real categories"
  ],
  "slides": [
    {
      "slide_number": 1,
      "title": "Main Title of the Presentation",
      "type": "cover_page",
      "subtitle": "Executive Market Analysis & Strategic Recommendations",
      "bullet_points": []
    },
    {
      "slide_number": 2,
      "title": "Analytical Slide Title",
      "type": "data_analysis",
      "bullet_points": [
        "Deep quantitative data point detailing exact revenue metrics or volume splits using real data fields.",
        "Strategic evaluation showing margin variances or specific satisfaction ratings from the rows.",
        "Targeted business recommendation addressing this slide's core insight."
      ],
      "visual_element": {
        "type": "chart",
        "chart_type": "bar",
        "title": "Visual Graph Title (Values in Rands)",
        "labels": ["Yangon", "Naypyitaw", "Mandalay"],
        "values": [101143, 105303, 101140]
      }
    }
  ]
}

CRITICAL RULES:
1. Except for the cover page, every analytical slide must contain a detailed 'visual_element' dictionary with 'labels' and 'values' fields filled with real extracted metrics.
2. Return ONLY valid, parseable JSON code.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Analyze this data package and build a presentation answering this request:\n{json.dumps(data_package, indent=2)}"}
        ],
        temperature=0.1
    )

    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.replace("```json", "").replace("```", "").strip()
        
    try:
        slide_outline = json.loads(raw)
        print(f"[Abi Convert] Done. Successfully mapped out {len(slide_outline['slides'])} descriptive slides with full data visualization schemas.")
        return slide_outline
    except Exception as e:
        print(f"[Abi Convert] JSON Parse critical failure. Raw output was: {raw}")
        raise e