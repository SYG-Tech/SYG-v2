// Educational Blog JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog components
    initBlog();
});

function initBlog() {
    // Initialize category filters
    initCategoryFilters();
    
    // Initialize blog search
    initBlogSearch();
    
    // Initialize comment system
    initCommentSystem();
    
    // Initialize share buttons
    initShareButtons();
    
    // Initialize newsletter subscription
    initNewsletterSubscription();
    
    // Initialize related posts
    initRelatedPosts();
}

// Category Filters
function initCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.blog-category');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            categoryLinks.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get category from data attribute
            const category = this.getAttribute('data-category');
            
            // Filter posts (in a real implementation, this would likely be a page reload or AJAX request)
            filterPostsByCategory(category);
        });
    });
}

function filterPostsByCategory(category) {
    // In a real implementation, this would likely be a page reload or AJAX request
    // For demo purposes, we'll just simulate filtering with a loading state
    
    const postGrid = document.querySelector('.post-grid, .post-list');
    if (!postGrid) return;
    
    // Show loading state
    postGrid.innerHTML = '<div class="loading-spinner" style="grid-column: 1 / -1; text-align: center; padding: 3rem;"><i class="fas fa-spinner fa-spin fa-3x"></i><p style="margin-top: 1rem;">Loading posts...</p></div>';
    
    // Simulate server request delay
    setTimeout(() => {
        // In a real implementation, this would update the posts based on the category
        // For now, we'll just restore the original content with a category filter message
        
        if (category === 'all') {
            // Reload the page to show all posts
            window.location.href = 'blog.html';
            return;
        }
        
        // Create a message showing which category is being filtered
        const filterMessage = document.createElement('div');
        filterMessage.style.gridColumn = '1 / -1';
        filterMessage.style.marginBottom = '2rem';
        filterMessage.innerHTML = `
            <div style="background-color: var(--background); padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <span>Showing posts in category: <strong>${category}</strong></span>
                <a href="blog.html" class="btn btn-small">Clear Filter</a>
            </div>
        `;
        
        // Generate mock posts for the selected category
        let mockPosts = '';
        
        // Number of posts to generate based on category
        const postCount = Math.floor(Math.random() * 3) + 3; // 3-5 posts
        
        for (let i = 0; i < postCount; i++) {
            mockPosts += generateMockPost(category, i);
        }
        
        // Update the post grid
        postGrid.innerHTML = '';
        postGrid.appendChild(filterMessage);
        
        // Create a container for the posts
        const postsContainer = document.createElement('div');
        postsContainer.className = postGrid.className;
        postsContainer.innerHTML = mockPosts;
        
        // Replace the post grid with the new container
        postGrid.parentNode.replaceChild(postsContainer, postGrid);
    }, 1000);
}

function generateMockPost(category, index) {
    // Generate a mock post based on the category
    const categoryTitles = {
        'value-guides': [
            "How Much is Your Old iPhone Really Worth?",
            "Understanding Depreciation in Electronics",
            "The True Cost of Cracked Screens",
            "Apple vs. Android: Which Holds Value Better?",
            "Maximizing Trade-In Value for Your Laptop"
        ],
        'recycling': [
            "The Environmental Impact of Electronics Recycling",
            "How Recycling Electronics Reduces Carbon Footprint",
            "E-Waste Crisis: What You Need to Know",
            "Responsible Disposal of Batteries and Accessories",
            "Corporate Recycling Programs: Leading by Example"
        ],
        'tech-trends': [
            "The Future of Foldable Devices",
            "5G Technology: What It Means for Your Devices",
            "AI Features in Modern Smartphones",
            "Upcoming Tech Releases to Watch For",
            "The Rise of Wearable Technology"
        ],
        'how-to': [
            "Preparing Your Phone for Sale: Essential Steps",
            "How to Back Up Your Data Before Selling",
            "Removing Personal Information from Devices",
            "Cleaning and Presenting Your Device for Maximum Value",
            "Shipping Electronics Safely: A Complete Guide"
        ]
    };
    
    // Default to value-guides if category not found
    const titles = categoryTitles[category] || categoryTitles['value-guides'];
    const title = titles[index % titles.length];
    
    // Generate excerpt based on title
    const excerpts = {
        'value-guides': "Learn about the factors that affect the resale value of your electronics and how to get the best price when selling your devices.",
        'recycling': "Discover the environmental benefits of properly recycling your electronic devices and how it contributes to a more sustainable future.",
        'tech-trends': "Stay up-to-date with the latest technology trends and innovations that are shaping the future of consumer electronics.",
        'how-to': "Follow our step-by-step guides to properly prepare your devices for sale, ensuring data security and maximum value."
    };
    
    const excerpt = excerpts[category] || "Read our latest blog post about electronics buyback and recycling.";
    
    // Generate a date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Generate HTML for the post
    return `
        <div class="post-card">
            <div class="post-image">
                <img src="images/blog/${category}-${(index % 3) + 1}.jpg" alt="${title}">
            </div>
            <div class="post-content">
                <span class="post-category">${formatCategory(category)}</span>
                <h3 class="post-title"><a href="blog-post.html?category=${category}">${title}</a></h3>
                <p class="post-excerpt">${excerpt}</p>
                <div class="post-meta">
                    <div class="post-author">
                        <div class="author-avatar">
                            <img src="images/authors/author${(index % 4) + 1}.jpg" alt="Author">
                        </div>
                        <span>Tech Team</span>
                    </div>
                    <div class="post-date">
                        <i class="far fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function formatCategory(category) {
    // Convert category slug to display name
    const categoryNames = {
        'value-guides': 'Value Guides',
        'recycling': 'Recycling',
        'tech-trends': 'Tech Trends',
        'how-to': 'How-To Guides'
    };
    
    return categoryNames[category] || category;
}

// Blog Search
function initBlogSearch() {
    const searchForm = document.querySelector('.blog-search');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = this.querySelector('input');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                searchBlog(searchTerm);
            }
        });
    }
}

function searchBlog(searchTerm) {
    // In a real implementation, this would be a server-side search
    // For demo purposes, we'll just simulate search results
    
    const postGrid = document.querySelector('.post-grid, .post-list');
    if (!postGrid) return;
    
    // Show loading state
    postGrid.innerHTML = '<div class="loading-spinner" style="grid-column: 1 / -1; text-align: center; padding: 3rem;"><i class="fas fa-spinner fa-spin fa-3x"></i><p style="margin-top: 1rem;">Searching...</p></div>';
    
    // Simulate server request delay
    setTimeout(() => {
        // Create a message showing search results
        const searchMessage = document.createElement('div');
        searchMessage.style.gridColumn = '1 / -1';
        searchMessage.style.marginBottom = '2rem';
        searchMessage.innerHTML = `
            <div style="background-color: var(--background); padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <span>Search results for: <strong>${searchTerm}</strong></span>
                <a href="blog.html" class="btn btn-small">Clear Search</a>
            </div>
        `;
        
        // Generate mock search results
        let mockResults = '';
        
        // Determine if we should show results or no results
        // For demo purposes, we'll show no results for very specific searches
        if (searchTerm.length > 10 && searchTerm.includes('z')) {
            mockResults = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search fa-3x" style="color: var(--light-gray);"></i>
                    <p style="margin-top: 1rem;">No results found for "${searchTerm}". Try different keywords.</p>
                </div>
            `;
        } else {
            // Number of results to generate
            const resultCount = Math.floor(Math.random() * 3) + 2; // 2-4 results
            
            // Generate results across different categories
            const categories = ['value-guides', 'recycling', 'tech-trends', 'how-to'];
            
            for (let i = 0; i < resultCount; i++) {
                const category = categories[i % categories.length];
                mockResults += generateMockPost(category, i);
            }
        }
        
        // Update the post grid
        postGrid.innerHTML = '';
        postGrid.appendChild(searchMessage);
        
        // Create a container for the posts
        const resultsContainer = document.createElement('div');
        resultsContainer.className = postGrid.className;
        resultsContainer.innerHTML = mockResults;
        
        // Replace the post grid with the new container
        postGrid.parentNode.replaceChild(resultsContainer, postGrid);
    }, 1500);
}

// Comment System
function initCommentSystem() {
    const commentForm = document.getElementById('comment-form');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateCommentForm()) {
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitButton.disabled = true;
            
            // Simulate server request delay
            setTimeout(() => {
                // Get form values
                const name = document.getElementById('comment-name').value;
                const email = document.getElementById('comment-email').value;
                const content = document.getElementById('comment-content').value;
                
                // Create new comment element
                const newComment = createCommentElement(name, content);
                
                // Add new comment to the list
                const commentList = document.querySelector('.comment-list');
                commentList.insertBefore(newComment, commentList.firstChild);
                
                // Reset form
                commentForm.reset();
                
                // Restore button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert-success';
                successMessage.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
                successMessage.style.color = '#2ecc71';
                successMessage.style.padding = '1rem';
                successMessage.style.borderRadius = '4px';
                successMessage.style.marginBottom = '1.5rem';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Your comment has been submitted and is awaiting moderation.';
                
                commentForm.parentNode.insertBefore(successMessage, commentForm);
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
        });
    }
}

function validateCommentForm() {
    let isValid = true;
    
    // Check name
    const nameInput = document.getElementById('comment-name');
    if (!nameInput.value.trim()) {
        isValid = false;
        nameInput.classList.add('error');
        
        // Add error message if it doesn't exist
        const nameGroup = nameInput.closest('.comment-form-group');
        if (!nameGroup.querySelector('.error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.color = '#e74c3c';
            errorMsg.style.fontSize = '0.875rem';
            errorMsg.style.marginTop = '0.5rem';
            errorMsg.textContent = 'Please enter your name';
            nameGroup.appendChild(errorMsg);
        }
    } else {
        nameInput.classList.remove('error');
        const nameGroup = nameInput.closest('.comment-form-group');
        const errorMsg = nameGroup.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }
    
    // Check email
    const emailInput = document.getElementById('comment-email');
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        isValid = false;
        emailInput.classList.add('error');
        
        // Add error message if it doesn't exist
        const emailGroup = emailInput.closest('.comment-form-group');
        if (!emailGroup.querySelector('.error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.color = '#e74c3c';
            errorMsg.style.fontSize = '0.875rem';
            errorMsg.style.marginTop = '0.5rem';
            errorMsg.textContent = 'Please enter a valid email address';
            emailGroup.appendChild(errorMsg);
        }
    } else {
        emailInput.classList.remove('error');
        const emailGroup = emailInput.closest('.comment-form-group');
        const errorMsg = emailGroup.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }
    
    // Check comment content
    const contentInput = document.getElementById('comment-content');
    if (!contentInput.value.trim() || contentInput.value.length < 10) {
        isValid = false;
        contentInput.classList.add('error');
        
        // Add error message if it doesn't exist
        const contentGroup = contentInput.closest('.comment-form-group');
        if (!contentGroup.querySelector('.error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.color = '#e74c3c';
            errorMsg.style.fontSize = '0.875rem';
            errorMsg.style.marginTop = '0.5rem';
            errorMsg.textContent = 'Please enter a comment (minimum 10 characters)';
            contentGroup.appendChild(errorMsg);
        }
    } else {
        contentInput.classList.remove('error');
        const contentGroup = contentInput.closest('.comment-form-group');
        const errorMsg = contentGroup.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }
    
    return isValid;
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function createCommentElement(name, content) {
    const comment = document.createElement('div');
    comment.className = 'comment';
    
    // Use current date
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Generate random avatar
    const avatarIndex = Math.floor(Math.random() * 6) + 1;
    
    comment.innerHTML = `
        <div class="comment-header">
            <div class="comment-avatar">
                <img src="images/avatars/avatar${avatarIndex}.jpg" alt="${name}">
            </div>
            <div class="comment-meta">
                <div class="comment-author">${name}</div>
                <div class="comment-date">${formattedDate}</div>
            </div>
        </div>
        <div class="comment-content">
            <p>${content}</p>
        </div>
    `;
    
    return comment;
}

// Share Buttons
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const type = this.getAttribute('data-share');
            const postUrl = encodeURIComponent(window.location.href);
            const postTitle = encodeURIComponent(document.title);
            
            let shareUrl;
            
            switch(type) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`;
                    break;
                case 'pinterest':
                    // Get the first image in the post
                    const firstImage = document.querySelector('.single-post-image img');
                    const imageUrl = firstImage ? encodeURIComponent(firstImage.src) : '';
                    shareUrl = `https://pinterest.com/pin/create/button/?url=${postUrl}&media=${imageUrl}&description=${postTitle}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${postTitle}&body=Check out this article: ${postUrl}`;
                    break;
            }
            
            // Open share dialog
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Newsletter Subscription
function initNewsletterSubscription() {
    const subscribeForm = document.querySelector('.subscribe-form');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email || !isValidEmail(email)) {
                // Show error
                emailInput.classList.add('error');
                
                // Add error message if it doesn't exist
                if (!this.querySelector('.error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = '#e74c3c';
                    errorMsg.style.fontSize = '0.875rem';
                    errorMsg.style.marginTop = '0.5rem';
                    errorMsg.textContent = 'Please enter a valid email address';
                    this.appendChild(errorMsg);
                }
                
                return;
            }
            
            // Remove error state
            emailInput.classList.remove('error');
            const errorMsg = this.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitButton.disabled = true;
            
            // Simulate server request delay
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Show success message
                this.innerHTML = `
                    <div style="text-align: center;">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: #2ecc71; margin-bottom: 1rem;"></i>
                        <h3>Thank You!</h3>
                        <p>You've been successfully subscribed to our newsletter.</p>
                    </div>
                `;
            }, 1500);
        });
    }
}

// Related Posts
function initRelatedPosts() {
    // In a real implementation, this would fetch related posts based on the current post
    // For now, we'll just simulate this with static content
    console.log('Related posts initialized');
}

// Add CSS class for form field validation styling
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .error {
            border-color: #e74c3c !important;
        }
    </style>
`);
