"""Base agent class for all AutoPilot AI agents."""

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any


class BaseAgent(ABC):
    """Abstract base class every agent must inherit from."""

    name: str = "BaseAgent"
    description: str = ""

    @abstractmethod
    def run(self, prompt: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        """Execute the agent's primary task and return a result dict."""
        ...
