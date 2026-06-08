"""Configurable company interview tracks with weighted focus areas."""

from __future__ import annotations

from dataclasses import dataclass, field

CATEGORY_BIG_TECH = "Big Tech"
CATEGORY_PRODUCT_SAAS = "Product / SaaS"
CATEGORY_TRADING_FINANCE = "Trading / Finance"
CATEGORY_INDIAN_PRODUCT = "Indian Product Companies"

COMPANY_CATEGORIES: tuple[str, ...] = (
    CATEGORY_BIG_TECH,
    CATEGORY_PRODUCT_SAAS,
    CATEGORY_TRADING_FINANCE,
    CATEGORY_INDIAN_PRODUCT,
)


@dataclass(frozen=True)
class CompanyTrack:
    name: str
    category: str
    weights: dict[str, float] = field(default_factory=dict)


def _w(**weights: float) -> dict[str, float]:
    return weights


def _track(name: str, category: str, **weights: float) -> CompanyTrack:
    return CompanyTrack(name=name, category=category, weights=_w(**weights))


# Weights are relative priorities — higher means more important for that track.
COMPANY_TRACKS: tuple[CompanyTrack, ...] = (
    # Big Tech
    _track("Google", CATEGORY_BIG_TECH, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.2, "Graphs": 1.1,
        "Dynamic Programming": 1.3, "Greedy": 0.9, "Binary Search": 1.0,
        "Sliding Window": 1.0, "Heaps": 0.9, "Backtracking": 0.8,
    }),
    _track("Meta", CATEGORY_BIG_TECH, **{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Graphs": 1.2, "Trees": 1.0,
        "Dynamic Programming": 1.2, "Greedy": 1.0, "Sliding Window": 1.0,
        "Binary Search": 0.9, "Backtracking": 0.8, "Heaps": 0.8,
    }),
    _track("Amazon", CATEGORY_BIG_TECH, **{
        "Arrays / Strings": 1.3, "Hashing": 1.1, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 1.0, "Stacks / Queues": 1.0,
        "Sliding Window": 1.1, "Binary Search": 0.9, "Heaps": 0.8,
    }),
    _track("Microsoft", CATEGORY_BIG_TECH, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.1, "Graphs": 1.0,
        "Dynamic Programming": 1.2, "Binary Search": 1.0, "Linked Lists": 0.9,
        "Stacks / Queues": 0.9, "Greedy": 0.8, "Intervals": 0.8,
    }),
    _track("Apple", CATEGORY_BIG_TECH, **{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Trees": 1.1, "Graphs": 1.0,
        "Dynamic Programming": 1.1, "Linked Lists": 0.9, "Stacks / Queues": 0.9,
        "Binary Search": 1.0, "Greedy": 0.8, "Bit Manipulation": 0.8,
    }),
    _track("Netflix", CATEGORY_BIG_TECH, **{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.2, "Greedy": 0.9, "Sliding Window": 1.0,
        "Binary Search": 0.9, "Backtracking": 0.8,
    }),
    _track("Uber", CATEGORY_BIG_TECH, **{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Graphs": 1.2, "Trees": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 1.0, "Heaps": 1.0,
        "Intervals": 1.0, "Binary Search": 0.9, "Sliding Window": 0.9,
    }),
    _track("Airbnb", CATEGORY_BIG_TECH, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Graphs": 1.1, "Trees": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 1.0, "Intervals": 1.0,
        "Sliding Window": 1.0, "Binary Search": 0.9, "Heaps": 0.8,
    }),
    _track("LinkedIn", CATEGORY_BIG_TECH, **{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Graphs": 1.1, "Trees": 1.0,
        "Dynamic Programming": 1.2, "Greedy": 0.9, "Sliding Window": 1.0,
        "Binary Search": 0.9, "Heaps": 0.8, "Intervals": 0.8,
    }),
    _track("Dropbox", CATEGORY_BIG_TECH, **{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Linked Lists": 0.9, "Stacks / Queues": 0.9,
        "Binary Search": 0.9, "Greedy": 0.8, "Sliding Window": 0.8,
    }),
    # Product / SaaS
    _track("Atlassian", CATEGORY_PRODUCT_SAAS, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 0.9, "Stacks / Queues": 0.9,
        "Binary Search": 0.9, "Sliding Window": 0.9, "Backtracking": 0.7,
    }),
    _track("Adobe", CATEGORY_PRODUCT_SAAS, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Linked Lists": 0.9, "Binary Search": 1.0,
        "Greedy": 0.8, "Stacks / Queues": 0.8, "Math": 0.7,
    }),
    _track("Salesforce", CATEGORY_PRODUCT_SAAS, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Linked Lists": 0.9, "Stacks / Queues": 0.9,
        "Greedy": 0.8, "Binary Search": 0.9, "Intervals": 0.8,
    }),
    _track("ServiceNow", CATEGORY_PRODUCT_SAAS, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Linked Lists": 0.9, "Stacks / Queues": 0.9,
        "Binary Search": 0.9, "Greedy": 0.8, "Intervals": 0.8,
    }),
    _track("Snowflake", CATEGORY_PRODUCT_SAAS, **{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.2, "Binary Search": 1.0, "Heaps": 0.9,
        "Greedy": 0.8, "Stacks / Queues": 0.8, "Math": 0.7,
    }),
    _track("Databricks", CATEGORY_PRODUCT_SAAS, **{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Graphs": 1.1, "Trees": 1.0,
        "Dynamic Programming": 1.2, "Greedy": 0.9, "Heaps": 1.0,
        "Binary Search": 0.9, "Sliding Window": 0.9, "Math": 0.7,
    }),
    _track("Stripe", CATEGORY_PRODUCT_SAAS, **{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.2, "Greedy": 0.9, "Binary Search": 1.0,
        "Stacks / Queues": 0.9, "Intervals": 0.8, "Math": 0.8,
    }),
    _track("Shopify", CATEGORY_PRODUCT_SAAS, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Linked Lists": 0.9, "Stacks / Queues": 0.9,
        "Greedy": 0.9, "Binary Search": 0.9, "Sliding Window": 0.8,
    }),
    _track("Notion", CATEGORY_PRODUCT_SAAS, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Linked Lists": 0.9, "Stacks / Queues": 0.9,
        "Binary Search": 0.9, "Greedy": 0.8, "Backtracking": 0.7,
    }),
    # Trading / Finance
    _track("Jane Street", CATEGORY_TRADING_FINANCE, **{
        "Math": 1.4, "Dynamic Programming": 1.3, "Greedy": 1.1, "Graphs": 1.0,
        "Heaps": 1.0, "Binary Search": 1.0, "Arrays / Strings": 1.0,
        "Hashing": 0.9, "Bit Manipulation": 0.9,
    }),
    _track("Citadel", CATEGORY_TRADING_FINANCE, **{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Graphs": 1.1, "Trees": 1.0,
        "Dynamic Programming": 1.3, "Greedy": 1.0, "Math": 1.2,
        "Binary Search": 1.0, "Heaps": 1.0, "Bit Manipulation": 0.9,
    }),
    _track("Hudson River Trading", CATEGORY_TRADING_FINANCE, **{
        "Math": 1.3, "Dynamic Programming": 1.2, "Greedy": 1.1, "Graphs": 1.0,
        "Heaps": 1.0, "Binary Search": 1.0, "Arrays / Strings": 1.0,
        "Hashing": 0.9, "Bit Manipulation": 1.0, "Sliding Window": 0.8,
    }),
    _track("Two Sigma", CATEGORY_TRADING_FINANCE, **{
        "Math": 1.3, "Dynamic Programming": 1.2, "Graphs": 1.1, "Greedy": 1.0,
        "Heaps": 1.0, "Binary Search": 1.0, "Arrays / Strings": 1.0,
        "Hashing": 0.9, "Trees": 0.9, "Bit Manipulation": 0.9,
    }),
    _track("DE Shaw", CATEGORY_TRADING_FINANCE, **{
        "Math": 1.3, "Dynamic Programming": 1.2, "Greedy": 1.1, "Graphs": 1.0,
        "Heaps": 1.0, "Binary Search": 1.0, "Arrays / Strings": 1.0,
        "Hashing": 0.9, "Trees": 0.9, "Bit Manipulation": 0.9,
    }),
    _track("Goldman Sachs", CATEGORY_TRADING_FINANCE, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Graphs": 1.0, "Trees": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 1.0, "Math": 1.0,
        "Binary Search": 0.9, "Heaps": 0.9, "Stacks / Queues": 0.8,
    }),
    _track("JPMorgan", CATEGORY_TRADING_FINANCE, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Greedy": 0.9, "Math": 1.0,
        "Binary Search": 0.9, "Linked Lists": 0.8, "Stacks / Queues": 0.8,
    }),
    # Indian Product Companies
    _track("Flipkart", CATEGORY_INDIAN_PRODUCT, **{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 1.0, "Sliding Window": 1.0,
        "Binary Search": 0.9, "Stacks / Queues": 0.8, "Heaps": 0.8,
    }),
    _track("Meesho", CATEGORY_INDIAN_PRODUCT, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Greedy": 1.0, "Sliding Window": 1.0,
        "Binary Search": 0.9, "Stacks / Queues": 0.8, "Linked Lists": 0.8,
    }),
    _track("Razorpay", CATEGORY_INDIAN_PRODUCT, **{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Greedy": 0.9, "Stacks / Queues": 0.9,
        "Binary Search": 0.9, "Linked Lists": 0.8, "Intervals": 0.8,
    }),
    _track("CRED", CATEGORY_INDIAN_PRODUCT, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Greedy": 0.9, "Sliding Window": 1.0,
        "Binary Search": 0.9, "Stacks / Queues": 0.8, "Heaps": 0.8,
    }),
    _track("Swiggy", CATEGORY_INDIAN_PRODUCT, **{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Graphs": 1.0, "Trees": 1.0,
        "Dynamic Programming": 1.0, "Greedy": 1.0, "Heaps": 0.9,
        "Binary Search": 0.9, "Sliding Window": 0.9, "Intervals": 0.8,
    }),
    _track("Zomato", CATEGORY_INDIAN_PRODUCT, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Graphs": 1.0, "Trees": 1.0,
        "Dynamic Programming": 1.0, "Greedy": 1.0, "Heaps": 0.9,
        "Binary Search": 0.9, "Sliding Window": 0.9, "Intervals": 0.8,
    }),
    _track("Groww", CATEGORY_INDIAN_PRODUCT, **{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Greedy": 0.9, "Math": 0.8,
        "Binary Search": 0.9, "Stacks / Queues": 0.8, "Sliding Window": 0.8,
    }),
    _track("PhonePe", CATEGORY_INDIAN_PRODUCT, **{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Greedy": 0.9, "Stacks / Queues": 0.9,
        "Binary Search": 0.9, "Linked Lists": 0.8, "Intervals": 0.8,
    }),
)


def get_company_tracks() -> tuple[CompanyTrack, ...]:
    """Return configured company tracks (add/remove entries in COMPANY_TRACKS)."""
    cleaned: list[CompanyTrack] = []
    for track in COMPANY_TRACKS:
        weights = {
            area: weight
            for area, weight in track.weights.items()
            if weight > 0
        }
        cleaned.append(CompanyTrack(name=track.name, category=track.category, weights=weights))
    return tuple(cleaned)
