"""CodeChef API Client via Scraping."""

import requests
from bs4 import BeautifulSoup
from typing import Any

class CodeChefClientError(Exception):
    pass

class CodeChefClient:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "Mozilla/5.0"})

    def get_user_profile(self, username: str) -> dict[str, Any]:
        url = f"https://www.codechef.com/users/{username}"
        try:
            resp = self.session.get(url)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, 'lxml')
            
            rating_div = soup.find('div', class_='rating-number')
            current_rating = 0
            if rating_div and rating_div.text.strip() and rating_div.text.strip().isdigit():
                current_rating = int(rating_div.text.strip())
                
            highest_rating_div = soup.find('div', class_='rating-header')
            highest_rating = 0
            if highest_rating_div:
                import re
                match = re.search(r'Highest Rating (\d+)', highest_rating_div.text)
                if match:
                    highest_rating = int(match.group(1))

            stars_div = soup.find('span', class_='rating')
            stars = "1★"
            if stars_div:
                stars = stars_div.text.strip()

            global_rank = "NA"
            country_rank = "NA"
            ranks_ul = soup.find('ul', class_='inline-list')
            if ranks_ul:
                links = ranks_ul.find_all('a')
                if len(links) >= 1:
                    global_rank = links[0].text.strip()
                if len(links) >= 2:
                    country_rank = links[1].text.strip()
            
            # Since scraping "Fully Solved" is unreliable, we just extract rating for now
            # and set solved to an estimate or 0 if we can't find it.
            solved_section = soup.find('section', class_='rating-data-section problems-solved')
            total_solved = 0
            if solved_section:
                h5 = solved_section.find('h5')
                if h5 and "Fully Solved" in h5.text:
                    import re
                    match = re.search(r'Fully Solved \((\d+)\)', h5.text)
                    if match:
                        total_solved = int(match.group(1))

            return {
                "username": username,
                "current_rating": current_rating,
                "highest_rating": highest_rating,
                "stars": stars,
                "global_rank": global_rank,
                "country_rank": country_rank,
                "total_solved": total_solved
            }
        except Exception as e:
            raise CodeChefClientError(f"Failed to fetch CodeChef profile: {e}")
