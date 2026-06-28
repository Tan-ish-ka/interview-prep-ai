"""LeetCode API Client using GraphQL."""

import requests
import json
from typing import Any

from interview_prep_ai.core.models.problem import ProblemRecord
from interview_prep_ai.core.models.tag_stat import TagStat

class LeetCodeClientError(Exception):
    pass

class LeetCodeClient:
    BASE_URL = "https://leetcode.com/graphql"

    def __init__(self):
        self.session = requests.Session()

    def get_user_profile(self, username: str) -> dict[str, Any]:
        query = """
        query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              realName
              ranking
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
              totalSubmissionNum {
                difficulty
                count
              }
            }
            tagProblemCounts {
              advanced { tagName tagSlug problemsSolved }
              intermediate { tagName tagSlug problemsSolved }
              fundamental { tagName tagSlug problemsSolved }
            }
          }
          userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
          }
        }
        """
        try:
            resp = self.session.post(
                self.BASE_URL,
                json={"query": query, "variables": {"username": username}},
                headers={"User-Agent": "Mozilla/5.0"}
            )
            resp.raise_for_status()
            data = resp.json()
            if "errors" in data:
                raise LeetCodeClientError(str(data["errors"]))
            return data["data"]
        except Exception as e:
            raise LeetCodeClientError(f"Failed to fetch LeetCode profile: {e}")
