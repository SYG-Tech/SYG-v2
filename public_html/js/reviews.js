// Customer Reviews Integration JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize review system components
    initReviewsSystem();
});

function initReviewsSystem() {
    // Initialize review carousel if it exists
    initReviewCarousel();
    
    // Initialize review filter if it exists
    initReviewFilter();
    
    // Initialize review submission form if it exists
    initReviewForm();
    
    // Initialize helpful buttons
    initHelpfulButtons();
    
    // Initialize review photo lightbox
    initReviewPhotoLightbox();
}

// Review Carousel for Homepage and Product Pages
function initReviewCarousel() {
    const carousels = document.querySelectorAll('.review-carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const nextButton = carousel.querySelector('.carousel-next');
        const prevButton = carousel.querySelector('.carousel-prev');
        const dots = carousel.querySelectorAll('.carousel-dot');
        
        if (!track || slides.length === 0) return;
        
        let currentIndex = 0;
        const slideWidth = 100; // percentage
        
        // Set initial position
        updateCarousel();
        
        // Add event listeners
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
        
        // Add dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        // Auto advance carousel
        let autoAdvance = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }, 5000);
        
        // Pause auto advance on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoAdvance);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoAdvance = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            }, 5000);
        });
        
        // Update carousel position and active dot
        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    });
}

// Review Filter System
function initReviewFilter() {
    const filterForm = document.getElementById('review-filter-form');
    if (!filterForm) return;
    
    // Star filter
    const starOptions = document.querySelectorAll('.star-option');
    starOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Toggle active class
            if (this.classList.contains('active')) {
                this.classList.remove('active');
            } else {
                starOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            }
            
            // Update hidden rating filter input
            const ratingInput = document.getElementById('rating-filter');
            if (ratingInput) {
                ratingInput.value = this.classList.contains('active') ? this.getAttribute('data-rating') : '';
            }
            
            // Trigger filter update
            applyFilters();
        });
    });
    
    // Location filter
    const locationSelect = document.getElementById('location-filter');
    if (locationSelect) {
        locationSelect.addEventListener('change', applyFilters);
    }
    
    // Product filter
    const productSelect = document.getElementById('product-filter');
    if (productSelect) {
        productSelect.addEventListener('change', applyFilters);
    }
    
    // Sort filter
    const sortSelect = document.getElementById('sort-filter');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    // Search filter
    const searchInput = document.getElementById('search-filter');
    if (searchInput) {
        let debounceTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(applyFilters, 500);
        });
    }
    
    // Apply filters function
    function applyFilters() {
        // In a real implementation, this would fetch filtered reviews from the server
        // For now, we'll just simulate filtering with a loading state
        
        const reviewsGrid = document.querySelector('.reviews-grid');
        if (!reviewsGrid) return;
        
        // Show loading state
        reviewsGrid.innerHTML = '<div class="loading-spinner" style="grid-column: 1 / -1; text-align: center; padding: 3rem;"><i class="fas fa-spinner fa-spin fa-3x"></i><p style="margin-top: 1rem;">Loading reviews...</p></div>';
        
        // Get filter values
        const rating = document.getElementById('rating-filter')?.value || '';
        const location = locationSelect?.value || '';
        const product = productSelect?.value || '';
        const sort = sortSelect?.value || 'newest';
        const search = searchInput?.value || '';
        
        // Simulate server request delay
        setTimeout(() => {
            // In a real implementation, this would update the reviews based on the filter results
            // For now, we'll just restore the original content
            loadMockFilteredReviews(reviewsGrid, { rating, location, product, sort, search });
        }, 1000);
    }
    
    // Load mock filtered reviews (in a real implementation, this would be server-side)
    function loadMockFilteredReviews(container, filters) {
        // This is a simplified mock implementation
        // In a real application, this would be handled by the server
        
        // Create a few mock reviews based on filters
        let mockReviews = '';
        
        // If no reviews match filters
        if (filters.rating === '1' && filters.product === 'laptop') {
            container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem;"><i class="fas fa-search fa-3x" style="color: var(--light-gray);"></i><p style="margin-top: 1rem;">No reviews match your filters. Try adjusting your criteria.</p></div>';
            return;
        }
        
        // Generate 6 mock reviews
        for (let i = 0; i < 6; i++) {
            const stars = filters.rating ? parseInt(filters.rating) : Math.floor(Math.random() * 3) + 3;
            const starIcons = '<i class="fas fa-star"></i>'.repeat(stars) + '<i class="far fa-star"></i>'.repeat(5 - stars);
            
            const productName = filters.product ? 
                (filters.product === 'iphone' ? 'iPhone 15 Pro' : 
                 filters.product === 'samsung' ? 'Samsung Galaxy S23' : 
                 filters.product === 'laptop' ? 'MacBook Pro' : 'Electronics Item') : 
                ['iPhone 15 Pro', 'Samsung Galaxy S23', 'MacBook Pro', 'iPad Air', 'Xbox Series X'][Math.floor(Math.random() * 5)];
            
            const locationName = filters.location ?
                (filters.location === 'newyork' ? 'New York City' :
                 filters.location === 'losangeles' ? 'Los Angeles' :
                 filters.location === 'chicago' ? 'Chicago' : 'Online') :
                ['New York City', 'Los Angeles', 'Chicago', 'Online', 'Miami'][Math.floor(Math.random() * 5)];
            
            const hasPhotos = Math.random() > 0.7;
            const photoSection = hasPhotos ? `
                <div class="review-photos">
                    <div class="review-photo">
                        <img src="images/reviews/review${i + 1}_1.jpg" alt="Review Photo">
                    </div>
                    ${Math.random() > 0.5 ? `
                    <div class="review-photo">
                        <img src="images/reviews/review${i + 1}_2.jpg" alt="Review Photo">
                    </div>
                    ` : ''}
                </div>
            ` : '';
            
            const reviewTexts = [
                "Great service and fair price for my device. The process was quick and painless.",
                "I was skeptical at first, but they offered more than other buyback services. Very satisfied!",
                "The staff was knowledgeable and helpful. Got a good deal on my old phone.",
                "Quick and easy process. The online quote matched what I received in-store.",
                "I've sold multiple devices here and always had a positive experience.",
                "They offered a competitive price and the payment was instant.",
                "The trade-in process was simple and the staff was friendly.",
                "Very professional service. I appreciated the transparent pricing.",
                "Got more than I expected for my old laptop. Will definitely use again.",
                "Fast service and fair pricing. No complaints at all."
            ];
            
            const reviewText = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
            
            // Skip review if search filter doesn't match
            if (filters.search && !reviewText.toLowerCase().includes(filters.search.toLowerCase()) && !productName.toLowerCase().includes(filters.search.toLowerCase())) {
                continue;
            }
            
            const reviewDate = new Date();
            reviewDate.setDate(reviewDate.getDate() - Math.floor(Math.random() * 60));
            const formattedDate = reviewDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            
            mockReviews += `
                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-avatar">
                            <img src="images/avatars/avatar${i + 1}.jpg" alt="Reviewer">
                        </div>
                        <div class="reviewer-info">
                            <div class="reviewer-name">Customer ${1000 + i}</div>
                            <div class="review-date">${formattedDate}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${starIcons}
                    </div>
                    <div class="review-verified">
                        <i class="fas fa-check-circle"></i> Verified Purchase
                    </div>
                    <div class="review-content">
                        <p>${reviewText}</p>
                        <p><strong>Product:</strong> ${productName}</p>
                        <p><strong>Location:</strong> ${locationName}</p>
                    </div>
                    ${photoSection}
                    <div class="review-footer">
                        <div class="review-helpful">
                            <button class="helpful-button">
                                <i class="far fa-thumbs-up"></i> Helpful
                            </button>
                            <span class="helpful-count">${Math.floor(Math.random() * 20)}</span>
                        </div>
                        <div class="review-source">
                            ${Math.random() > 0.5 ? '<img src="images/google-logo.png" alt="Google">' : '<img src="images/yelp-logo.png" alt="Yelp">'}
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (mockReviews === '') {
            container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem;"><i class="fas fa-search fa-3x" style="color: var(--light-gray);"></i><p style="margin-top: 1rem;">No reviews match your search. Try different keywords.</p></div>';
        } else {
            container.innerHTML = mockReviews;
            
            // Re-initialize helpful buttons
            initHelpfulButtons();
            
            // Re-initialize photo lightbox
            initReviewPhotoLightbox();
        }
    }
}

// Review Submission Form
function initReviewForm() {
    const reviewForm = document.getElementById('review-submission-form');
    if (!reviewForm) return;
    
    // Star rating selection
    const ratingStars = document.querySelectorAll('.rating-star');
    const ratingInput = document.getElementById('rating-input');
    
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = index + 1;
            
            // Update visual state
            ratingStars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
            
            // Update hidden input
            if (ratingInput) {
                ratingInput.value = rating;
            }
        });
    });
    
    // Photo upload preview
    const photoInput = document.getElementById('photo-upload');
    const previewContainer = document.querySelector('.upload-preview');
    
    if (photoInput && previewContainer) {
        photoInput.addEventListener('change', function() {
            previewContainer.innerHTML = '';
            
            if (this.files) {
                const maxFiles = 5;
                const files = Array.from(this.files).slice(0, maxFiles);
                
                files.forEach(file => {
                    if (!file.type.match('image.*')) return;
                    
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const previewItem = document.createElement('div');
                        previewItem.className = 'preview-item';
                        
                        previewItem.innerHTML = `
                            <img src="${e.target.result}" alt="Preview">
                            <div class="remove-preview">
                                <i class="fas fa-times"></i>
                            </div>
                        `;
                        
                        previewContainer.appendChild(previewItem);
                        
                        // Add remove functionality
                        const removeButton = previewItem.querySelector('.remove-preview');
                        removeButton.addEventListener('click', function() {
                            previewItem.remove();
                            // Note: In a real implementation, you would need to handle
                            // removing the file from the FileList, which is not directly possible.
                            // You would typically use a custom solution with a hidden input.
                        });
                    };
                    
                    reader.readAsDataURL(file);
                });
                
                // Show message if more than max files were selected
                if (this.files.length > maxFiles) {
                    const message = document.createElement('div');
                    message.style.width = '100%';
                    message.style.marginTop = '0.5rem';
                    message.style.fontSize = '0.875rem';
                    message.style.color = '#e74c3c';
                    message.textContent = `Only the first ${maxFiles} images will be uploaded.`;
                    previewContainer.appendChild(message);
                }
            }
        });
    }
    
    // Form submission
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateReviewForm()) {
            return;
        }
        
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;
        
        // Simulate server request delay
        setTimeout(() => {
            // In a real implementation, this would submit the form data to the server
            
            // Show success message
            const formContainer = document.querySelector('.review-form-container');
            
            formContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; color: var(--secondary); margin-bottom: 1rem;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Thank You for Your Review!</h2>
                    <p>Your feedback helps other customers make informed decisions.</p>
                    <p style="margin-top: 1rem;">Your review will be published after moderation.</p>
                    <a href="reviews.html" class="btn btn-primary" style="margin-top: 2rem;">View All Reviews</a>
                </div>
            `;
        }, 1500);
    });
    
    // Form validation
    function validateReviewForm() {
        let isValid = true;
        
        // Check rating
        const rating = ratingInput ? ratingInput.value : '';
        if (!rating) {
            isValid = false;
            document.querySelector('.rating-select').classList.add('error');
            
            // Add error message if it doesn't exist
            if (!document.querySelector('.rating-error')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'rating-error';
                errorMsg.style.color = '#e74c3c';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.style.marginTop = '0.5rem';
                errorMsg.textContent = 'Please select a rating';
                document.querySelector('.rating-select').appendChild(errorMsg);
            }
        } else {
            document.querySelector('.rating-select').classList.remove('error');
            const errorMsg = document.querySelector('.rating-error');
            if (errorMsg) errorMsg.remove();
        }
        
        // Check review text
        const reviewText = document.getElementById('review-text').value.trim();
        if (reviewText.length < 10) {
            isValid = false;
            document.getElementById('review-text').classList.add('error');
            
            // Add error message if it doesn't exist
            const textGroup = document.getElementById('review-text').closest('.form-group');
            if (!textGroup.querySelector('.text-error')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'text-error';
                errorMsg.style.color = '#e74c3c';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.style.marginTop = '0.5rem';
                errorMsg.textContent = 'Please enter at least 10 characters';
                textGroup.appendChild(errorMsg);
            }
        } else {
            document.getElementById('review-text').classList.remove('error');
            const textGroup = document.getElementById('review-text').closest('.form-group');
            const errorMsg = textGroup.querySelector('.text-error');
            if (errorMsg) errorMsg.remove();
        }
        
        return isValid;
    }
}

// Helpful Buttons
function initHelpfulButtons() {
    const helpfulButtons = document.querySelectorAll('.helpful-button');
    
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Check if already clicked
            if (this.classList.contains('clicked')) return;
            
            // Update button state
            this.classList.add('clicked');
            this.innerHTML = '<i class="fas fa-thumbs-up"></i> Helpful';
            
            // Update count
            const countElement = this.nextElementSibling;
            if (countElement && countElement.classList.contains('helpful-count')) {
                const currentCount = parseInt(countElement.textContent) || 0;
                countElement.textContent = currentCount + 1;
            }
            
            // In a real implementation, this would send the helpful vote to the server
        });
    });
}

// Review Photo Lightbox
function initReviewPhotoLightbox() {
    const reviewPhotos = document.querySelectorAll('.review-photo');
    
    reviewPhotos.forEach(photo => {
        photo.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'review-lightbox';
            lightbox.style.position = 'fixed';
            lightbox.style.top = '0';
            lightbox.style.left = '0';
            lightbox.style.width = '100%';
            lightbox.style.height = '100%';
            lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            lightbox.style.display = 'flex';
            lightbox.style.alignItems = 'center';
            lightbox.style.justifyContent = 'center';
            lightbox.style.zIndex = '9999';
            
            // Create image
            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            img.style.objectFit = 'contain';
            
            // Create close button
            const closeBtn = document.createElement('div');
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '20px';
            closeBtn.style.right = '20px';
            closeBtn.style.color = 'white';
            closeBtn.style.fontSize = '2rem';
            closeBtn.style.cursor = 'pointer';
            
            // Add elements to lightbox
            lightbox.appendChild(img);
            lightbox.appendChild(closeBtn);
            
            // Add lightbox to body
            document.body.appendChild(lightbox);
            
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
            
            // Close on button click
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
            });
            
            // Close on background click
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                }
            });
        });
    });
}

// Load reviews from third-party platforms
function loadThirdPartyReviews() {
    // This would typically use APIs to fetch reviews from platforms like Google, Yelp, etc.
    // For now, we'll just simulate this with mock data
    
    // Google Reviews
    loadGoogleReviews();
    
    // Yelp Reviews
    loadYelpReviews();
}

function loadGoogleReviews() {
    // In a real implementation, this would use the Google Places API
    console.log('Loading Google Reviews...');
}

function loadYelpReviews() {
    // In a real implementation, this would use the Yelp Fusion API
    console.log('Loading Yelp Reviews...');
}

// Add schema.org markup for rich snippets
function addReviewSchema() {
    // This would typically be done server-side, but can be added via JavaScript
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    // Create schema data based on page content
    const schemaData = {
        "@context": "https://schema.org/",
        "@type": "LocalBusiness",
        "name": "SellYourGadgets.com",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250",
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": [
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Customer 1001"
                },
                "datePublished": "2025-03-15",
                "reviewBody": "Great service and fair price for my device. The process was quick and painless.",
                "name": "Excellent service",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5",
                    "worstRating": "1"
                }
            },
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Customer 1002"
                },
                "datePublished": "2025-03-10",
                "reviewBody": "I was skeptical at first, but they offered more than other buyback services. Very satisfied!",
                "name": "Great price",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5",
                    "worstRating": "1"
                }
            }
        ]
    };
    
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

// Add CSS class for form field validation styling
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .error {
            border-color: #e74c3c !important;
        }
        
        .rating-select.error .rating-stars {
            animation: shake 0.5s;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    </style>
`);
