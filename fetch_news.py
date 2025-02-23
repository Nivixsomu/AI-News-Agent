from flask import Flask, jsonify, request
from flask_cors import CORS
import requests  # Import for API calls

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Replace with your NewsAPI.org API Key
NEWS_API_KEY = "0f2b785daab14177b3ef5ddfe6ca43e9"

@app.route('/fetch-news', methods=['GET'])
def fetch_news():
    state = request.args.get('state')
    city = request.args.get('city')

    if not state or not city:
        return jsonify({"error": "State and city are required"}), 400

    # Construct query for News API (search by city and state name)
    query = f"{city}, {state} news"
    news_url = f"https://newsapi.org/v2/everything?q={query}&apiKey={NEWS_API_KEY}&language=en&sortBy=publishedAt"

    response = requests.get(news_url)
    
    if response.status_code != 200:
        return jsonify({"error": f"Failed to fetch news. API returned {response.status_code}"}), 500

    news_data = response.json()
    articles = news_data.get("articles", [])

    formatted_articles = [
        {
            "title": article.get("title", "No Title"),
            "summary": article.get("description", "No description available."),
            "url": article.get("url", "#"),
            "image": article.get("urlToImage", "default-news.jpg"),
            "source": article.get("source", {}).get("name", "Unknown Source"),
            "publishedAt": article.get("publishedAt", "Unknown Date")
        }
        for article in articles[:5]  # Limit to 5 news items
    ]

    return jsonify({"articles": formatted_articles})


@app.route('/search-news', methods=['GET'])
def search_news():
    """Fetch news based on a keyword search."""
    query = request.args.get('query')

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    news_url = f"https://newsapi.org/v2/everything?q={query}&apiKey={NEWS_API_KEY}&language=en&sortBy=publishedAt"

    response = requests.get(news_url)

    if response.status_code != 200:
        return jsonify({"error": f"Failed to fetch news. API returned {response.status_code}"}), 500

    news_data = response.json()
    articles = news_data.get("articles", [])

    formatted_articles = [
        {
            "title": article.get("title", "No Title"),
            "summary": article.get("description", "No description available."),
            "url": article.get("url", "#"),
            "image": article.get("urlToImage", "default-news.jpg"),
            "source": article.get("source", {}).get("name", "Unknown Source"),
            "publishedAt": article.get("publishedAt", "Unknown Date")
        }
        for article in articles[:5]  # Limit to 5 news items
    ]

    return jsonify({"articles": formatted_articles})


if __name__ == '__main__':
    app.run(debug=True)
