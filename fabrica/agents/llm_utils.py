from __future__ import annotations

from typing import Any


def wrap_document(text: str) -> str:
    body = text.rstrip()
    if not body:
        return "<document>\n</document>"
    return f"<document>\n{body}\n</document>"


def extract_usage(response: Any) -> dict[str, int]:
    usage = getattr(response, "usage", None)
    if usage is None:
        return {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}

    def _get(name: str) -> int:
        if isinstance(usage, dict):
            value = usage.get(name, 0)
        else:
            value = getattr(usage, name, 0)
        try:
            return int(value or 0)
        except (TypeError, ValueError):
            return 0

    return {
        "prompt_tokens": _get("prompt_tokens"),
        "completion_tokens": _get("completion_tokens"),
        "total_tokens": _get("total_tokens"),
    }
