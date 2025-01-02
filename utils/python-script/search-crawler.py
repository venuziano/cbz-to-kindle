import requests
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

def search_google(api_key, cse_id, search_query, target_url, start_page=1):
    base_url = "https://www.googleapis.com/customsearch/v1"
    page = start_page
    start_index = (start_page - 1) * 10 + 1

    while True:
        print(f"Searching page {page}...")
        params = {
            'key': api_key,
            'cx': cse_id,
            'q': search_query,
            'start': start_index
        }

        print("Request parameters:", params)
        response = requests.get(base_url, params=params)

        if response.status_code != 200:
            print(f"Error: {response.status_code} - {response.text}")
            break

        data = response.json()
        results = data.get("items", [])

        # Check each result for the target URL
        for result in results:
            link = result.get("link")
            if target_url in link:
                print(f"Found URL: {link} on page {page}")
                return {
                    "page": page,
                    "url": link
                }

        # Check if there are more pages of results
        if "nextPage" in data.get("queries", {}):
            start_index += 10
            page += 1
        else:
            print("No more pages to search.")
            break

    print("Target URL not found.")
    return None

if __name__ == "__main__":
    # Replace these with your Google API credentials
    API_KEY = os.getenv("PYTHON_SCRIPT_GOOGLE_SEARCH_ENGINE_API_KEY")
    CSE_ID = os.getenv("PYTHON_SCRIPT_GOOGLE_CSE_ID")

    # Replace with your search query and target URL
    SEARCH_QUERY = "cbz to pdf"
    # SEARCH_QUERY = "convert cbz to pdf"
    TARGET_URL = "https://www.cbz-to-pdf.com.br/"
    # TARGET_URL = "https://cloudconvert.com/cbz-to-pdf"

    # Specify the page to start searching from
    START_PAGE = 1

    result = search_google(API_KEY, CSE_ID, SEARCH_QUERY, TARGET_URL, start_page=START_PAGE)

    if result:
        print(f"Target URL found on page {result['page']}: {result['url']}")
    else:
        print("Target URL not found in search results.")