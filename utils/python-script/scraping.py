import requests
from bs4 import BeautifulSoup
import time

def search_google_scrape(search_query, target_url, start_page=1, max_pages=10):
    base_url = "https://www.google.com/search"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    for page in range(start_page, start_page + max_pages):
        print(f"Searching page {page}...")

        # Calculate start parameter for pagination
        start_index = (page - 1) * 10

        params = {
            "q": search_query,
            "start": start_index
        }

        response = requests.get(base_url, headers=headers, params=params)

        if response.status_code != 200:
            print(f"Error: {response.status_code}")
            break

        soup = BeautifulSoup(response.text, "html.parser")

        # Parse search results
        search_results = soup.find_all("div", class_="tF2Cxc")

        for result in search_results:
            link_tag = result.find("a")
            if link_tag:
                link = link_tag["href"]
                print(f"### LINK: {link} ###")
                # Check if the link matches the target URL
                if link == target_url:
                    print(f"Target URL found: {link} on page {page}")
                    return {
                        "page": page,
                        "url": link
                    }

        print(f"Finished searching page {page}. Moving to the next page...")

        # Delay to avoid getting blocked by Google
        time.sleep(2)

    print("Target URL not found.")
    return None

if __name__ == "__main__":
    # Replace with your search query and target URL
    SEARCH_QUERY = "cbz to pdf"
    TARGET_URL = "https://www.cbz-to-pdf.com.br/"

    # Specify the page to start searching from
    START_PAGE = 1

    result = search_google_scrape(SEARCH_QUERY, TARGET_URL, start_page=START_PAGE, max_pages=10)

    if result:
        print(f"Target URL found on page {result['page']}: {result['url']}")
    else:
        print("Target URL not found in search results.")
