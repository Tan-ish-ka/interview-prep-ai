"""Company Intelligence Knowledge Base for the Interview Prep Engine."""

from __future__ import annotations

from typing import TypedDict

class PreviousQuestion(TypedDict):
    title: str
    platform: str
    difficulty: str
    tags: list[str]
    frequency: str
    year: str

class CompanyProfile(TypedDict):
    name: str
    category: str
    expected_topics: dict[str, dict[str, float]]  # e.g. "Dynamic Programming": {"weight": 1.5, "target_solved": 50}
    difficulty_distribution: dict[str, float]     # e.g. "Easy": 0.1, "Medium": 0.5, "Hard": 0.4
    interview_rounds: list[str]
    oa_pattern: str
    previous_questions: list[PreviousQuestion]

COMPANY_KNOWLEDGE_BASE: list[CompanyProfile] = [
    {
        "name": "Google",
        "category": "FAANG",
        "expected_topics": {
            "Graphs": {"weight": 1.5, "target_solved": 40},
            "Dynamic Programming": {"weight": 1.4, "target_solved": 50},
            "Trees": {"weight": 1.3, "target_solved": 45},
            "Strings": {"weight": 1.1, "target_solved": 30},
            "Math": {"weight": 0.8, "target_solved": 15},
            "Arrays": {"weight": 1.0, "target_solved": 40},
        },
        "difficulty_distribution": {"Easy": 0.05, "Medium": 0.45, "Hard": 0.50},
        "interview_rounds": ["1 OA", "1 Phone", "4-5 Onsite (DS&A + System Design)"],
        "oa_pattern": "Usually 2 questions (1 Medium, 1 Hard) in 90 mins. Heavy on DP and Graphs.",
        "previous_questions": [
            {
                "title": "Binary Tree Maximum Path Sum",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Trees", "DFS", "Dynamic Programming"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Longest Increasing Path in a Matrix",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Graphs", "DFS", "Memoization"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Evaluate Equation",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Graphs", "Union Find", "DFS"],
                "frequency": "Medium",
                "year": "2024"
            }
        ]
    },
    {
        "name": "Amazon",
        "category": "FAANG",
        "expected_topics": {
            "Arrays": {"weight": 1.5, "target_solved": 60},
            "Strings": {"weight": 1.4, "target_solved": 50},
            "Graphs": {"weight": 1.2, "target_solved": 30},
            "Trees": {"weight": 1.2, "target_solved": 40},
            "Sliding Window": {"weight": 1.3, "target_solved": 25},
            "Priority Queue": {"weight": 1.1, "target_solved": 20},
        },
        "difficulty_distribution": {"Easy": 0.20, "Medium": 0.60, "Hard": 0.20},
        "interview_rounds": ["1 OA", "1 Phone", "4 Onsite (DS&A + LP + System Design)"],
        "oa_pattern": "2 Questions in 90 minutes. Focus on Arrays, Hash Maps, and Sliding Window.",
        "previous_questions": [
            {
                "title": "LRU Cache",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Design", "Hash Table", "Linked List"],
                "frequency": "Very High",
                "year": "2023-2025"
            },
            {
                "title": "Number of Islands",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Graphs", "DFS", "BFS"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "K Closest Points to Origin",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Heap", "Priority Queue", "Math"],
                "frequency": "Medium",
                "year": "2024"
            }
        ]
    },
    {
        "name": "Microsoft",
        "category": "Big Tech",
        "expected_topics": {
            "Arrays": {"weight": 1.5, "target_solved": 50},
            "Strings": {"weight": 1.4, "target_solved": 40},
            "Linked Lists": {"weight": 1.2, "target_solved": 25},
            "Trees": {"weight": 1.1, "target_solved": 35},
            "Dynamic Programming": {"weight": 0.9, "target_solved": 20},
        },
        "difficulty_distribution": {"Easy": 0.30, "Medium": 0.55, "Hard": 0.15},
        "interview_rounds": ["1 OA", "1 Phone", "3-4 Onsite (DS&A + System Design)"],
        "oa_pattern": "Codility OA. Usually 3 questions in 90-120 mins. Heavy on Arrays and Strings.",
        "previous_questions": [
            {
                "title": "Two Sum",
                "platform": "LeetCode",
                "difficulty": "Easy",
                "tags": ["Arrays", "Hash Table"],
                "frequency": "Very High",
                "year": "2023-2025"
            },
            {
                "title": "Spiral Matrix",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Arrays", "Matrix", "Simulation"],
                "frequency": "High",
                "year": "2024"
            },
            {
                "title": "Reverse Linked List",
                "platform": "LeetCode",
                "difficulty": "Easy",
                "tags": ["Linked Lists", "Recursion"],
                "frequency": "High",
                "year": "2023-2025"
            }
        ]
    },
    {
        "name": "Meta",
        "category": "FAANG",
        "expected_topics": {
            "Arrays": {"weight": 1.6, "target_solved": 70},
            "Strings": {"weight": 1.5, "target_solved": 55},
            "Hash Table": {"weight": 1.4, "target_solved": 45},
            "Trees": {"weight": 1.3, "target_solved": 40},
            "Graphs": {"weight": 1.1, "target_solved": 30},
        },
        "difficulty_distribution": {"Easy": 0.15, "Medium": 0.70, "Hard": 0.15},
        "interview_rounds": ["1 Phone", "4 Onsite (2 DS&A + 1 System Design + 1 Behavioral)"],
        "oa_pattern": "Rarely OA for Senior. Focuses heavily on speed and bug-free code for standard LeetCode Mediums.",
        "previous_questions": [
            {
                "title": "Valid Palindrome II",
                "platform": "LeetCode",
                "difficulty": "Easy",
                "tags": ["Strings", "Two Pointers"],
                "frequency": "Very High",
                "year": "2024-2025"
            },
            {
                "title": "Kth Largest Element in an Array",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Arrays", "Divide and Conquer", "Sorting", "Heap"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Binary Tree Right Side View",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Trees", "DFS", "BFS"],
                "frequency": "High",
                "year": "2023-2024"
            }
        ]
    },
    {
        "name": "Uber",
        "category": "Unicorn",
        "expected_topics": {
            "Graphs": {"weight": 1.6, "target_solved": 45},
            "Trees": {"weight": 1.4, "target_solved": 40},
            "Dynamic Programming": {"weight": 1.3, "target_solved": 35},
            "Design": {"weight": 1.2, "target_solved": 15},
            "Hash Table": {"weight": 1.1, "target_solved": 30},
        },
        "difficulty_distribution": {"Easy": 0.05, "Medium": 0.50, "Hard": 0.45},
        "interview_rounds": ["1 OA", "1 Phone", "4 Onsite (2 DS&A, 1 System Design, 1 Behavioral)"],
        "oa_pattern": "CodeSignal OA. Heavy focus on graphs and pathfinding algorithms.",
        "previous_questions": [
            {
                "title": "Word Search II",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Trie", "Array", "String", "Backtracking"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Course Schedule II",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Graphs", "Topological Sort", "BFS", "DFS"],
                "frequency": "Medium",
                "year": "2024"
            },
            {
                "title": "Design Hit Counter",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Design", "Queue", "Hash Table"],
                "frequency": "Medium",
                "year": "2023-2024"
            }
        ]
    },
    {
        "name": "Atlassian",
        "category": "SaaS",
        "expected_topics": {
            "Arrays": {"weight": 1.5, "target_solved": 40},
            "Design": {"weight": 1.5, "target_solved": 20},
            "Hash Table": {"weight": 1.3, "target_solved": 30},
            "Strings": {"weight": 1.2, "target_solved": 30},
        },
        "difficulty_distribution": {"Easy": 0.10, "Medium": 0.70, "Hard": 0.20},
        "interview_rounds": ["1 OA", "1 Phone", "3-4 Onsite (1 DS&A, 1 System Design, 1 Code Review, 1 Values)"],
        "oa_pattern": "HackerRank OA. Focuses heavily on practical object-oriented design and parsing.",
        "previous_questions": [
            {
                "title": "Design Snake Game",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Design", "Queue", "Array"],
                "frequency": "High",
                "year": "2024-2025"
            },
            {
                "title": "Find And Replace in String",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Array", "String", "Sorting"],
                "frequency": "High",
                "year": "2023-2024"
            }
        ]
    },
    {
        "name": "Adobe",
        "category": "Software",
        "expected_topics": {
            "Dynamic Programming": {"weight": 1.4, "target_solved": 30},
            "Strings": {"weight": 1.3, "target_solved": 35},
            "Arrays": {"weight": 1.3, "target_solved": 45},
            "Math": {"weight": 1.2, "target_solved": 15},
            "Linked Lists": {"weight": 1.1, "target_solved": 20},
        },
        "difficulty_distribution": {"Easy": 0.30, "Medium": 0.50, "Hard": 0.20},
        "interview_rounds": ["1 OA", "1 Phone", "4 Onsite (DS&A + Core CS + System Design)"],
        "oa_pattern": "HackerRank/Platform OA. Good mix of DP, Arrays and OS/DBMS questions.",
        "previous_questions": [
            {
                "title": "Two Sum",
                "platform": "LeetCode",
                "difficulty": "Easy",
                "tags": ["Array", "Hash Table"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Reverse Nodes in k-Group",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Linked List", "Recursion"],
                "frequency": "Medium",
                "year": "2024"
            }
        ]
    },
    {
        "name": "Flipkart",
        "category": "E-Commerce",
        "expected_topics": {
            "Dynamic Programming": {"weight": 1.5, "target_solved": 40},
            "Graphs": {"weight": 1.4, "target_solved": 35},
            "Trees": {"weight": 1.3, "target_solved": 30},
            "Design": {"weight": 1.5, "target_solved": 15},
        },
        "difficulty_distribution": {"Easy": 0.10, "Medium": 0.50, "Hard": 0.40},
        "interview_rounds": ["1 OA", "1 Phone", "3 Onsite (1 Machine Coding, 1 DS&A, 1 System Design)"],
        "oa_pattern": "HackerRank OA. Usually requires solving DP and Graph questions optimally. Heavy focus on Machine Coding.",
        "previous_questions": [
            {
                "title": "Minimum Window Substring",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Hash Table", "String", "Sliding Window"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Word Ladder",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Hash Table", "String", "BFS"],
                "frequency": "Medium",
                "year": "2024"
            }
        ]
    },
    {
        "name": "Goldman Sachs",
        "category": "FinTech",
        "expected_topics": {
            "Math": {"weight": 1.6, "target_solved": 25},
            "Arrays": {"weight": 1.4, "target_solved": 45},
            "Hash Table": {"weight": 1.3, "target_solved": 35},
            "Dynamic Programming": {"weight": 1.1, "target_solved": 20},
        },
        "difficulty_distribution": {"Easy": 0.35, "Medium": 0.55, "Hard": 0.10},
        "interview_rounds": ["1 OA", "1 CoderPad", "3-4 Onsite (DS&A + Math/Probability)"],
        "oa_pattern": "HackerRank OA with 2 questions (Math/Arrays) and CS fundamentals MCQs.",
        "previous_questions": [
            {
                "title": "Trapping Rain Water",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Fraction to Recurring Decimal",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Hash Table", "Math", "String"],
                "frequency": "Medium",
                "year": "2024"
            }
        ]
    },
    {
        "name": "Walmart Global Tech",
        "category": "E-Commerce",
        "expected_topics": {
            "Trees": {"weight": 1.4, "target_solved": 35},
            "Dynamic Programming": {"weight": 1.3, "target_solved": 25},
            "Graphs": {"weight": 1.2, "target_solved": 25},
            "Linked Lists": {"weight": 1.2, "target_solved": 20},
        },
        "difficulty_distribution": {"Easy": 0.20, "Medium": 0.60, "Hard": 0.20},
        "interview_rounds": ["1 OA", "2 Technical Onsite", "1 Managerial"],
        "oa_pattern": "HackerRank OA. Usually focuses on Trees and DP.",
        "previous_questions": [
            {
                "title": "Maximum Subarray",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Array", "Divide and Conquer", "Dynamic Programming"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Lowest Common Ancestor of a Binary Tree",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Tree", "DFS", "Binary Tree"],
                "frequency": "Medium",
                "year": "2024"
            }
        ]
    },
    {
        "name": "Oracle",
        "category": "Enterprise",
        "expected_topics": {
            "Trees": {"weight": 1.4, "target_solved": 30},
            "Strings": {"weight": 1.3, "target_solved": 35},
            "Linked Lists": {"weight": 1.3, "target_solved": 25},
            "Arrays": {"weight": 1.1, "target_solved": 40},
        },
        "difficulty_distribution": {"Easy": 0.30, "Medium": 0.60, "Hard": 0.10},
        "interview_rounds": ["1 Phone", "4 Onsite (DS&A + Core Java/C++ + System Design)"],
        "oa_pattern": "Mostly skips OA for experienced. Heavy on fundamental data structures.",
        "previous_questions": [
            {
                "title": "Merge Intervals",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Array", "Sorting"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Valid Parentheses",
                "platform": "LeetCode",
                "difficulty": "Easy",
                "tags": ["String", "Stack"],
                "frequency": "High",
                "year": "2024"
            }
        ]
    },
    {
        "name": "Visa",
        "category": "FinTech",
        "expected_topics": {
            "Strings": {"weight": 1.4, "target_solved": 35},
            "Arrays": {"weight": 1.4, "target_solved": 40},
            "Hash Table": {"weight": 1.3, "target_solved": 30},
            "Math": {"weight": 1.2, "target_solved": 15},
        },
        "difficulty_distribution": {"Easy": 0.40, "Medium": 0.55, "Hard": 0.05},
        "interview_rounds": ["1 OA", "2 Technical Onsite", "1 HR"],
        "oa_pattern": "HackerRank OA. String manipulation and basic array traversals.",
        "previous_questions": [
            {
                "title": "Group Anagrams",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Array", "Hash Table", "String", "Sorting"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Reverse Words in a String",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["Two Pointers", "String"],
                "frequency": "Medium",
                "year": "2024"
            }
        ]
    },
    {
        "name": "DE Shaw",
        "category": "Quant",
        "expected_topics": {
            "Dynamic Programming": {"weight": 1.6, "target_solved": 50},
            "Math": {"weight": 1.5, "target_solved": 30},
            "Graphs": {"weight": 1.4, "target_solved": 40},
            "Trees": {"weight": 1.2, "target_solved": 35},
        },
        "difficulty_distribution": {"Easy": 0.05, "Medium": 0.45, "Hard": 0.50},
        "interview_rounds": ["1 OA", "1 Phone", "4 Onsite (Heavy DS&A and Math)"],
        "oa_pattern": "HackerRank OA. Math heavy, Hard DP, and CS Fundamentals (OS/DBMS/Networks).",
        "previous_questions": [
            {
                "title": "Median of Two Sorted Arrays",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Array", "Binary Search", "Divide and Conquer"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Edit Distance",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "tags": ["String", "Dynamic Programming"],
                "frequency": "Medium",
                "year": "2024"
            }
        ]
    },
    {
        "name": "Jane Street",
        "category": "Quant",
        "expected_topics": {
            "Graphs": {"weight": 1.7, "target_solved": 50},
            "Math": {"weight": 1.6, "target_solved": 40},
            "Dynamic Programming": {"weight": 1.5, "target_solved": 50},
            "Design": {"weight": 1.4, "target_solved": 20},
        },
        "difficulty_distribution": {"Easy": 0.0, "Medium": 0.20, "Hard": 0.80},
        "interview_rounds": ["1 Phone", "3-4 Onsite (Algorithms, Systems, Probability)"],
        "oa_pattern": "No traditional OA. Relies heavily on live algorithmic pairing and probability.",
        "previous_questions": [
            {
                "title": "Alien Dictionary",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Array", "String", "Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Design In-Memory File System",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Design", "Trie", "Hash Table", "String"],
                "frequency": "Medium",
                "year": "2024"
            }
        ]
    },
    {
        "name": "HRT",
        "category": "Quant",
        "expected_topics": {
            "Arrays": {"weight": 1.5, "target_solved": 50},
            "Strings": {"weight": 1.4, "target_solved": 40},
            "Design": {"weight": 1.6, "target_solved": 25},
            "Math": {"weight": 1.3, "target_solved": 25},
        },
        "difficulty_distribution": {"Easy": 0.05, "Medium": 0.40, "Hard": 0.55},
        "interview_rounds": ["1 OA", "1 Phone", "4 Onsite (Low-level systems + DS&A)"],
        "oa_pattern": "Codility OA. Focuses heavily on high-performance C++ constructs and low-latency design.",
        "previous_questions": [
            {
                "title": "LFU Cache",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Design", "Hash Table", "Linked List", "Doubly-Linked List"],
                "frequency": "High",
                "year": "2023-2025"
            },
            {
                "title": "Maximum Profit in Job Scheduling",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "tags": ["Array", "Binary Search", "Dynamic Programming", "Sorting"],
                "frequency": "Medium",
                "year": "2024"
            }
        ]
    }
]
