document.addEventListener("DOMContentLoaded", function () {
    const stateCityMap = {
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Noida", "Agra"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
        "Karnataka": ["Bangalore", "Mysore", "Hubli"],
        "Delhi": ["New Delhi", "Dwarka", "Rohini"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
        "West Bengal": ["Kolkata", "Durgapur", "Howrah"]
    };

    const stateSelect = document.getElementById("state");
    const citySelect = document.getElementById("city");
    const fetchNewsBtn = document.getElementById("fetchNews");
    const searchInput = document.getElementById("searchInput");
    const searchNewsBtn = document.getElementById("searchNews");
    const newsContainer = document.getElementById("news-container");

    // Populate city dropdown based on selected state
    stateSelect.addEventListener("change", function () {
        const selectedState = stateSelect.value;
        citySelect.innerHTML = "<option value=''>Select City</option>";

        if (selectedState && stateCityMap[selectedState]) {
            stateCityMap[selectedState].forEach(city => {
                let option = document.createElement("option");
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    });

    // Fetch news based on location
    fetchNewsBtn.addEventListener("click", function () {
        const selectedState = stateSelect.value;
        const selectedCity = citySelect.value;

        if (!selectedState || !selectedCity) {
            alert("Please select both state and city.");
            return;
        }

        const apiUrl = `http://127.0.0.1:5000/fetch-news?state=${selectedState}&city=${selectedCity}`;
        fetchNews(apiUrl);
    });

    // Fetch news based on search query
    searchNewsBtn.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (!query) {
            alert("Please enter a keyword to search for news.");
            return;
        }

        const apiUrl = `http://127.0.0.1:5000/search-news?query=${encodeURIComponent(query)}`;
        fetchNews(apiUrl);
    });

    // Fetch and display news
    function fetchNews(apiUrl) {
        console.log("Fetching news from:", apiUrl);

        fetch(apiUrl)
            .then(response => {
                console.log("Fetch request sent.");
                console.log("Response status:", response.status);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Received data from server:", data);
                newsContainer.innerHTML = "";

                if (data.articles && data.articles.length > 0) {
                    data.articles.forEach(article => {
                        let newsItem = document.createElement("div");
                        newsItem.classList.add("col-md-4", "mb-3");
                        newsItem.innerHTML = `
                            <div class="card p-3">
                                <h5>${article.title}</h5>
                                <img src="${article.image || 'default-news.jpg'}" class="img-fluid mb-2" alt="News Image">
                                <p>${article.summary}</p>
                                <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
                            </div>
                        `;
                        newsContainer.appendChild(newsItem);
                    });
                } else {
                    console.warn("No news available.");
                    newsContainer.innerHTML = "<p class='text-center'>No news available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching news:", error);
                newsContainer.innerHTML = `<p class='text-center text-danger'>Failed to fetch news. Check server status.</p>`;
            });
    }
});
