document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');

    // Event Listeners
    searchBtn.addEventListener('click', searchBooks);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBooks();
        }
    });

    // Main Search Function
    function searchBooks() {
        const query = searchInput.value.trim();
        
        if (!query) {
            showError('Please enter a search term');
            return;
        }

        // Show loading state
        resultsContainer.innerHTML = '<div class="loading">Searching for books...</div>';
        
        // Fetch books from Open Library API
        fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayResults(data.docs);
            })
            .catch(error => {
                showError('Failed to fetch books. Please try again later.');
                console.error('Error:', error);
            });
    }

    // Display Results
    function displayResults(books) {
        if (!books || books.length === 0) {
            resultsContainer.innerHTML = '<div class="error">No books found. Try a different search term.</div>';
            return;
        }

        let html = '<div class="results-section">';
        
        // Limit to 12 results for better performance
        books.slice(0, 12).forEach(book => {
            const coverId = book.cover_i;
            const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : '';
            const title = book.title || 'Unknown Title';
            const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
            const year = book.first_publish_year || 'Year not available';

            html += `
                <div class="book-card">
                    <div class="book-cover">
                        ${coverUrl ? `<img src="${coverUrl}" alt="${title}">` : 'No cover available'}
                    </div>
                    <div class="book-info">
                        <div class="book-title">${title}</div>
                        <div class="book-author">${author}</div>
                        <div class="book-year">${year}</div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        resultsContainer.innerHTML = html;
    }

    // Show Error Message
    function showError(message) {
        resultsContainer.innerHTML = `<div class="error">${message}</div>`;
    }
});