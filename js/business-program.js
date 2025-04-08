// Business Bulk Purchase Program JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });
    
    // Form Validation
    const bulkQuoteForm = document.getElementById('bulk-quote-form');
    
    if (bulkQuoteForm) {
        bulkQuoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = bulkQuoteForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Check if at least one device category is selected
            const deviceCategories = document.querySelectorAll('input[name="device-categories"]');
            let deviceCategorySelected = false;
            
            deviceCategories.forEach(category => {
                if (category.checked) {
                    deviceCategorySelected = true;
                }
            });
            
            if (!deviceCategorySelected) {
                isValid = false;
                document.querySelector('.device-categories').classList.add('error');
            } else {
                document.querySelector('.device-categories').classList.remove('error');
            }
            
            // If form is valid, submit or show success message
            if (isValid) {
                // In a real implementation, this would submit the form data
                // For now, we'll just show a success message
                showSuccessMessage();
            } else {
                // Scroll to the first error
                const firstError = bulkQuoteForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
    
    // Success message function
    function showSuccessMessage() {
        // Hide the form
        bulkQuoteForm.style.display = 'none';
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Quote Request Submitted!</h3>
            <p>Thank you for your interest in our Business Bulk Purchase Program. One of our business specialists will contact you within 1 business day to discuss your quote.</p>
            <p>A confirmation email has been sent to the address you provided.</p>
            <button class="btn btn-primary" id="reset-form">Submit Another Request</button>
        `;
        
        // Add success message to the form container
        const formContainer = document.querySelector('.quote-form-container');
        formContainer.appendChild(successMessage);
        
        // Add event listener to reset button
        document.getElementById('reset-form').addEventListener('click', function() {
            bulkQuoteForm.reset();
            bulkQuoteForm.style.display = 'flex';
            successMessage.remove();
        });
    }
    
    // File upload preview
    const fileUpload = document.getElementById('file-upload');
    
    if (fileUpload) {
        fileUpload.addEventListener('change', function() {
            const fileName = this.files[0]?.name;
            if (fileName) {
                const filePreview = document.createElement('p');
                filePreview.className = 'file-preview';
                filePreview.innerHTML = `<i class="fas fa-file"></i> ${fileName}`;
                
                // Remove any existing preview
                const existingPreview = document.querySelector('.file-preview');
                if (existingPreview) {
                    existingPreview.remove();
                }
                
                // Add new preview
                this.parentNode.appendChild(filePreview);
            }
        });
    }
    
    // Dynamic form fields based on selection
    const industrySelect = document.getElementById('industry');
    
    if (industrySelect) {
        industrySelect.addEventListener('change', function() {
            // Example of showing/hiding additional fields based on industry selection
            if (this.value === 'education' || this.value === 'government') {
                // Could show special fields for education/government
                document.querySelectorAll('.special-field').forEach(field => {
                    field.style.display = 'block';
                });
            } else {
                document.querySelectorAll('.special-field').forEach(field => {
                    field.style.display = 'none';
                });
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add CSS class for form field validation styling
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .error {
                border-color: #ff3860 !important;
            }
            
            .success-message {
                text-align: center;
                padding: 3rem;
                background-color: #fff;
                border-radius: 8px;
            }
            
            .success-message i {
                font-size: 4rem;
                color: var(--secondary);
                margin-bottom: 1rem;
            }
            
            .file-preview {
                margin-top: 0.5rem;
                color: var(--primary);
            }
            
            .special-field {
                display: none;
            }
        </style>
    `);
});
