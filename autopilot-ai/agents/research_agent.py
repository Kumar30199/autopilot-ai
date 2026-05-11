"""
Research Agent — Gathers intelligence and references on a topic using LLM.
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
    # Try raw parse
    try:
        return json.loads(raw_content)
    except:
        return {"key_points": ["Could not parse JSON response."], "references": []}

async def research(topic: str) -> Dict[str, any]:
    """
    Performs real research on a given topic using Groq.
    """
    if not GROQ_API_KEY:
        return {
            "key_points": [
                f"Mock Data (No API Key): Preliminary analysis suggests '{topic}' is a multifaceted subject.",
                "Current trends indicate a shift toward automated monitoring.",
                "Optimization of resource allocation is a primary challenge."
            ],
            "references": [
                {"title": f"The Evolution of {topic}", "author": "Mock Research Inst.", "year": 2024}
            ]
        }

    system_prompt = """You are an expert Research Analyst AI.
Your task is to analyze the provided topic and return structured intelligence.
You MUST respond with valid JSON only. Do not include any other text.
Format:
{
  "key_points": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "references": [
    {"title": "Book/Article Name", "author": "Author Name", "year": 2024}
  ]
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
            {"role": "user", "content": f"Please research the following topic: {topic}"}
        ],
        "temperature": 0.2
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=20.0
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            return extract_json_from_text(content)
    except Exception as e:
        print(f"[RESEARCH ERROR] {e}")
        return {
            "key_points": [f"Error fetching research: {str(e)}"],
            "references": []
        }

if __name__ == "__main__":
    import asyncio
    example_topic = "Generative AI"
    print(f"Researching: {example_topic}\n")
    data = asyncio.run(research(example_topic))
    
    print("KEY FINDINGS:")
    for point in data.get("key_points", []):
        print(f"- {point}")

