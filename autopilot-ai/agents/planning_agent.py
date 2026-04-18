"""
Planning Agent — Simple and modular task decomposition.
"""

from __future__ import annotations
from typing import List


def plan(goal: str) -> List[str]:
    """
    Decomposes a high-level goal into a series of structured steps.
    
    Args:
        goal: The objective to be planned.
        
    Returns:
        A list of instructional steps.
    """
    # Simple deterministic logic/mapping for common goals
    # In a real system, this would call an LLM.
    
    goal_lower = goal.lower()
    
    if "todo" in goal_lower:
        return [
            "Understand requirements for the Todo application",
            "Define core features (Create, Read, Update, Delete)",
            "Design the UI/UX layout",
            "Generate the frontend and backend code",
            "Perform unit testing and validation"
        ]
    
    if "website" in goal_lower or "web app" in goal_lower:
        return [
            "Research target audience and competitors",
            "Create a site map and wireframes",
            "Select technology stack (e.g., React, Next.js)",
            "Build responsive UI components",
            "Implement backend logic and database connectivity",
            "Deploy to a cloud provider"
        ]
        
    # Default generic plan for other goals
    return [
        f"Analyze requirements for: '{goal}'",
        "Identify necessary resources and dependencies",
        "Design a step-by-step implementation strategy",
        "Execute core development tasks",
        "Verify final output against original goal"
    ]


if __name__ == "__main__":
    # Example usage
    example_goal = "Build a todo app"
    print(f"Goal: {example_goal}")
    print("Plan:")
    for i, step in enumerate(plan(example_goal), 1):
        print(f"{i}. {step}")
