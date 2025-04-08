// Binding Quotes Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const lockQuoteBtn = document.getElementById('lock-quote-btn');
    const emailInput = document.getElementById('email-input');
    const phoneInput = document.getElementById('phone-input');
    const quoteValiditySelect = document.getElementById('quote-validity');
    const lockQuoteForm = document.getElementById('lock-quote-form');
    const bindingQuoteResult = document.getElementById('binding-quote-result');
    const quoteCodeDisplay = document.getElementById('quote-code');
    const quoteExpiryDisplay = document.getElementById('quote-expiry');
    const estimatePrice = document.querySelector('.estimate-price');
    const priceRange = document.querySelector('.price-range');
    
    // Device selection elements
    const deviceTypeCards = document.querySelectorAll('.option-card');
    const brandSelect = document.getElementById('brand-select');
    const modelSelect = document.getElementById('model-select');
    const storageSelect = document.getElementById('storage-select');
    const conditionOptions = document.querySelectorAll('.condition-option');
    
    // Show lock quote form when "Lock This Quote" button is clicked
    if (lockQuoteBtn) {
        lockQuoteBtn.addEventListener('click', function() {
            lockQuoteForm.style.display = 'block';
            lockQuoteBtn.style.display = 'none';
            
            // Scroll to the form
            lockQuoteForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Generate a random quote code
    function generateQuoteCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    
    // Calculate expiry date based on validity period
    function calculateExpiryDate(days) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(days));
        return expiryDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Handle form submission
    if (lockQuoteForm) {
        lockQuoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!emailInput.value || !phoneInput.value) {
                alert('Please enter both email and phone number');
                return;
            }
            
            // Get the current estimated price
            const currentPrice = estimatePrice.textContent;
            const validityDays = quoteValiditySelect.value;
            
            // Generate quote code and expiry date
            const quoteCode = generateQuoteCode();
            const expiryDate = calculateExpiryDate(validityDays);
            
            // Display binding quote result
            quoteCodeDisplay.textContent = quoteCode;
            quoteExpiryDisplay.textContent = expiryDate;
            bindingQuoteResult.style.display = 'block';
            lockQuoteForm.style.display = 'none';
            
            // Send confirmation email (simulated)
            console.log(`Sending confirmation email to ${emailInput.value} with quote code ${quoteCode}`);
            
            // In a real implementation, this would make an AJAX call to a server endpoint
            // to store the binding quote in a database and send a confirmation email
        });
    }
    
    // Update the estimated price when selections change
    function updateEstimatedPrice() {
        // Get selected device type
        let deviceType = '';
        deviceTypeCards.forEach(card => {
            if (card.classList.contains('selected')) {
                deviceType = card.id.replace('device-', '');
            }
        });
        
        // Get other selections
        const brand = brandSelect.value;
        const model = modelSelect.value;
        const storage = storageSelect.value;
        
        // Get selected condition
        let condition = '';
        conditionOptions.forEach(option => {
            if (option.classList.contains('selected')) {
                condition = option.id.replace('condition-', '');
            }
        });
        
        // Only calculate if all selections are made
        if (deviceType && brand && model && storage && condition) {
            // In a real implementation, this would use a more sophisticated pricing algorithm
            // or make an API call to get the actual price
            
            // Simple price calculation for demonstration
            let basePrice = 0;
            
            // Base price by model (simplified)
            if (model.includes('15pro')) {
                basePrice = 900;
            } else if (model.includes('14pro')) {
                basePrice = 700;
            } else if (model.includes('13pro')) {
                basePrice = 500;
            } else {
                basePrice = 400;
            }
            
            // Adjust for storage
            if (storage === '512') {
                basePrice += 100;
            } else if (storage === '1tb') {
                basePrice += 200;
            } else if (storage === '64') {
                basePrice -= 50;
            }
            
            // Adjust for condition
            let conditionMultiplier = 1.0;
            switch(condition) {
                case 'excellent':
                    conditionMultiplier = 1.0;
                    break;
                case 'good':
                    conditionMultiplier = 0.9;
                    break;
                case 'fair':
                    conditionMultiplier = 0.75;
                    break;
                case 'poor':
                    conditionMultiplier = 0.5;
                    break;
            }
            
            // Calculate final price
            const finalPrice = Math.round(basePrice * conditionMultiplier);
            
            // Calculate price range
            const minPrice = Math.round(finalPrice * 0.95);
            const maxPrice = Math.round(finalPrice * 1.05);
            
            // Update display
            estimatePrice.textContent = `$${finalPrice}`;
            priceRange.textContent = `Price range: $${minPrice} - $${maxPrice}`;
            
            // Show lock quote button
            if (lockQuoteBtn) {
                lockQuoteBtn.style.display = 'block';
            }
        }
    }
    
    // Add event listeners to update price when selections change
    deviceTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            deviceTypeCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            this.classList.add('selected');
            updateEstimatedPrice();
        });
    });
    
    brandSelect.addEventListener('change', updateEstimatedPrice);
    modelSelect.addEventListener('change', updateEstimatedPrice);
    storageSelect.addEventListener('change', updateEstimatedPrice);
    
    conditionOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            conditionOptions.forEach(o => o.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
            updateEstimatedPrice();
        });
    });
});
