"""
Analysis Agent — Performs reasoning-based analysis using LLM.
"""

from __future__ import annotations
from typing import Dict, List
import os
import httpx
import json
import re

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

def extract_json_from_text(raw_content: str) -> dict:
    raw_content = raw_content.strip()
    # Find ```json blocks
    blocks = re.findall(r'```(?:json)?\s*(.*?)\s*```', raw_content, re.DOTALL)
    if blocks:
        for block in reversed(blocks):
            try:
                return json.loads(block, strict=False)
            except:
                continue
    # Try finding first { and last }
    first_brace = raw_content.find('{')
    last_brace = raw_content.rfind('}')
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        try:
            return json.loads(raw_content[first_brace:last_brace+1], strict=False)
        except:
            pass
    try:
        return json.loads(raw_content)
    except:
        return {"insights": ["Could not parse JSON response."], "summary": "Error during analysis."}

async def analyze(topic_or_data: any) -> Dict[str, any]:
    """
    Analyzes input data using Groq to extract insights.
    """
    if not GROQ_API_KEY:
        return {
            "insights": [
                "Mock Data (No API Key): Correlation identified between features.",
                "Strategic risk: Resource allocation dependencies may delay execution."
            ],
            "summary": "Analysis complete for the provided dataset. Mock reasoning applied.",
            "reasoning_level": "advanced",
            "confidence_score": 0.92
        }

    system_prompt = """You are an elite Business and Technology Analyst AI.
Your task is to analyze the provided query or data and generate a structured analysis report.
You MUST respond with valid JSON only. Do not include any other text.
Format:
{
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "pros_cons": {"pros": ["Pro 1"], "cons": ["Con 1"]},
  "risks": ["Risk 1", "Risk 2"],
  "recommendations": ["Rec 1", "Rec 2"],
  "summary": "A cohesive 2-sentence summary of the analysis."
}
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Please analyze this data/topic:\n{topic_or_data}"}
        ],
        "temperature": 0.3
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=25.0
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            return extract_json_from_text(content)
    except Exception as e:
        print(f"[ANALYSIS ERROR] {e}")
        return {
            "insights": [f"Error fetching analysis: {str(e)}"],
            "summary": "Analysis failed.",
            "pros_cons": {"pros": [], "cons": []},
            "risks": [],
            "recommendations": []
        }

if __name__ == "__main__":
    import asyncio
    mock_topic = "Generative AI in Healthcare"
    print("Performing Analysis...\n")
    data = asyncio.run(analyze(mock_topic))
    
    print("INSIGHTS:")
    for insight in data.get("insights", []):
        print(f"★ {insight}")
        
    print(f"\nANALYTICAL SUMMARY:\n{data.get('summary', '')}")

