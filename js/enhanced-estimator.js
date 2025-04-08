// Enhanced Price Estimator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the enhanced estimator
    initEnhancedEstimator();
});

function initEnhancedEstimator() {
    // Elements
    const progressSteps = document.querySelectorAll('.progress-step');
    const stepContainers = document.querySelectorAll('.estimator-step-container');
    const nextButtons = document.querySelectorAll('.btn-next-step');
    const prevButtons = document.querySelectorAll('.btn-prev-step');
    const deviceCards = document.querySelectorAll('.option-card');
    const modelCards = document.querySelectorAll('.model-card');
    const conditionOptions = document.querySelectorAll('.condition-option');
    const deliveryOptions = document.querySelectorAll('.delivery-option');
    const quoteForm = document.getElementById('quote-form');
    
    // Set up progress navigation
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.getAttribute('data-current-step'));
            const nextStep = currentStep + 1;
            
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                goToStep(nextStep);
                updateProgressBar(nextStep);
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.getAttribute('data-current-step'));
            const prevStep = currentStep - 1;
            
            goToStep(prevStep);
            updateProgressBar(prevStep);
        });
    });
    
    // Device selection
    deviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Deselect all cards
            deviceCards.forEach(c => c.classList.remove('selected'));
            
            // Select clicked card
            this.classList.add('selected');
            
            // Update device type in form
            document.getElementById('selected-device').value = this.getAttribute('data-device');
            
            // Update available brands based on device type
            updateBrands(this.getAttribute('data-device'));
        });
    });
    
    // Model selection
    modelCards.forEach(card => {
        card.addEventListener('click', function() {
            // Deselect all cards
            modelCards.forEach(c => c.classList.remove('selected'));
            
            // Select clicked card
            this.classList.add('selected');
            
            // Update model in form
            document.getElementById('selected-model').value = this.getAttribute('data-model');
            
            // Update available storage options based on model
            updateStorageOptions(this.getAttribute('data-model'));
        });
    });
    
    // Condition selection
    conditionOptions.forEach(option => {
        option.addEventListener('click', function() {
            // For each condition question group, only one option can be selected
            const questionGroup = this.closest('.condition-question').querySelectorAll('.condition-option');
            questionGroup.forEach(o => o.classList.remove('selected'));
            
            // Select clicked option
            this.classList.add('selected');
            
            // Update condition in form
            const conditionType = this.closest('.condition-question').getAttribute('data-condition-type');
            document.getElementById('condition-' + conditionType).value = this.getAttribute('data-condition-value');
            
            // Update price estimate in real-time
            updatePriceEstimate();
        });
    });
    
    // Delivery options
    deliveryOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Deselect all options
            deliveryOptions.forEach(o => o.classList.remove('selected'));
            
            // Select clicked option
            this.classList.add('selected');
            
            // Update delivery method in form
            document.getElementById('delivery-method').value = this.getAttribute('data-delivery');
            
            // Show/hide relevant form fields based on delivery method
            toggleDeliveryFields(this.getAttribute('data-delivery'));
        });
    });
    
    // Quote form submission
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateQuoteForm()) {
                // Generate quote
                generateBindingQuote();
            }
        });
    }
    
    // Initialize tooltips
    initTooltips();
    
    // Set up print functionality
    setupPrintFunctionality();
}

function goToStep(stepNumber) {
    // Hide all step containers
    document.querySelectorAll('.estimator-step-container').forEach(container => {
        container.classList.remove('active');
    });
    
    // Show the target step container
    const targetContainer = document.querySelector(`.estimator-step-container[data-step="${stepNumber}"]`);
    if (targetContainer) {
        targetContainer.classList.add('active');
    }
    
    // Scroll to top of container
    document.querySelector('.enhanced-estimator-container').scrollIntoView({ behavior: 'smooth' });
}

function updateProgressBar(currentStep) {
    // Update progress steps
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        // Convert from 0-based index to 1-based step number
        const stepNumber = index + 1;
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function validateStep(stepNumber) {
    // Validation logic for each step
    switch(stepNumber) {
        case 1: // Device selection
            return document.querySelector('.option-card.selected') !== null;
        case 2: // Brand selection
            return document.getElementById('brand-select').value !== '';
        case 3: // Model selection
            return document.querySelector('.model-card.selected') !== null || document.getElementById('model-select').value !== '';
        case 4: // Storage/Configuration
            return document.getElementById('storage-select').value !== '';
        case 5: // Condition assessment
            // Check if all condition questions have been answered
            const conditionQuestions = document.querySelectorAll('.condition-question');
            return Array.from(conditionQuestions).every(question => {
                return question.querySelector('.condition-option.selected') !== null;
            });
        default:
            return true;
    }
}

function validateQuoteForm() {
    const requiredFields = document.querySelectorAll('#quote-form [required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('email-input');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        isValid = false;
        emailField.classList.add('error');
    }
    
    // Validate phone format
    const phoneField = document.getElementById('phone-input');
    if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
        isValid = false;
        phoneField.classList.add('error');
    }
    
    return isValid;
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isValidPhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phone));
}

function updateBrands(deviceType) {
    // This would typically fetch from a database
    // For now, we'll use a simple switch case
    const brandSelect = document.getElementById('brand-select');
    
    // Clear existing options
    brandSelect.innerHTML = '<option value="">Select Brand</option>';
    
    // Add new options based on device type
    switch(deviceType) {
        case 'smartphone':
            addBrandOptions(brandSelect, [
                { value: 'apple', text: 'Apple' },
                { value: 'samsung', text: 'Samsung' },
                { value: 'google', text: 'Google' },
                { value: 'oneplus', text: 'OnePlus' },
                { value: 'motorola', text: 'Motorola' }
            ]);
            break;
        case 'tablet':
            addBrandOptions(brandSelect, [
                { value: 'apple', text: 'Apple' },
                { value: 'samsung', text: 'Samsung' },
                { value: 'microsoft', text: 'Microsoft' },
                { value: 'lenovo', text: 'Lenovo' },
                { value: 'amazon', text: 'Amazon' }
            ]);
            break;
        case 'laptop':
            addBrandOptions(brandSelect, [
                { value: 'apple', text: 'Apple' },
                { value: 'dell', text: 'Dell' },
                { value: 'hp', text: 'HP' },
                { value: 'lenovo', text: 'Lenovo' },
                { value: 'asus', text: 'Asus' }
            ]);
            break;
        // Add more device types as needed
    }
}

function addBrandOptions(selectElement, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        selectElement.appendChild(optionElement);
    });
}

function updateStorageOptions(model) {
    // This would typically fetch from a database
    // For now, we'll use a simple switch case
    const storageSelect = document.getElementById('storage-select');
    
    // Clear existing options
    storageSelect.innerHTML = '<option value="">Select Storage</option>';
    
    // Add new options based on model
    if (model.includes('iphone')) {
        addStorageOptions(storageSelect, [
            { value: '64', text: '64GB' },
            { value: '128', text: '128GB' },
            { value: '256', text: '256GB' },
            { value: '512', text: '512GB' },
            { value: '1tb', text: '1TB' }
        ]);
    } else if (model.includes('galaxy')) {
        addStorageOptions(storageSelect, [
            { value: '128', text: '128GB' },
            { value: '256', text: '256GB' },
            { value: '512', text: '512GB' }
        ]);
    } else if (model.includes('macbook')) {
        addStorageOptions(storageSelect, [
            { value: '256', text: '256GB' },
            { value: '512', text: '512GB' },
            { value: '1tb', text: '1TB' },
            { value: '2tb', text: '2TB' }
        ]);
    }
    // Add more models as needed
}

function addStorageOptions(selectElement, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        selectElement.appendChild(optionElement);
    });
}

function updatePriceEstimate() {
    // This would typically calculate based on device, model, storage, and condition
    // For now, we'll use a simple calculation
    
    // Get selected values
    const deviceType = document.getElementById('selected-device').value;
    const brand = document.getElementById('brand-select').value;
    const model = document.getElementById('selected-model').value;
    const storage = document.getElementById('storage-select').value;
    
    // Get condition values
    const screenCondition = document.getElementById('condition-screen')?.value || '';
    const bodyCondition = document.getElementById('condition-body')?.value || '';
    const functionalCondition = document.getElementById('condition-functional')?.value || '';
    
    // Calculate base price (this would be more complex in a real implementation)
    let basePrice = 0;
    
    if (model.includes('iphone15pro')) {
        basePrice = 800;
    } else if (model.includes('iphone14pro')) {
        basePrice = 600;
    } else if (model.includes('iphone13pro')) {
        basePrice = 400;
    } else if (model.includes('galaxy-s23')) {
        basePrice = 700;
    } else if (model.includes('galaxy-s22')) {
        basePrice = 500;
    } else if (model.includes('macbook-pro')) {
        basePrice = 1200;
    } else if (model.includes('macbook-air')) {
        basePrice = 800;
    } else {
        basePrice = 300; // Default
    }
    
    // Adjust for storage
    if (storage === '128') {
        basePrice += 50;
    } else if (storage === '256') {
        basePrice += 100;
    } else if (storage === '512') {
        basePrice += 150;
    } else if (storage === '1tb') {
        basePrice += 200;
    } else if (storage === '2tb') {
        basePrice += 300;
    }
    
    // Adjust for condition
    let conditionMultiplier = 1.0;
    
    // Screen condition
    if (screenCondition === 'perfect') {
        conditionMultiplier *= 1.0;
    } else if (screenCondition === 'minor') {
        conditionMultiplier *= 0.9;
    } else if (screenCondition === 'noticeable') {
        conditionMultiplier *= 0.8;
    } else if (screenCondition === 'cracked') {
        conditionMultiplier *= 0.6;
    }
    
    // Body condition
    if (bodyCondition === 'perfect') {
        conditionMultiplier *= 1.0;
    } else if (bodyCondition === 'minor') {
        conditionMultiplier *= 0.95;
    } else if (bodyCondition === 'noticeable') {
        conditionMultiplier *= 0.85;
    } else if (bodyCondition === 'damaged') {
        conditionMultiplier *= 0.7;
    }
    
    // Functional condition
    if (functionalCondition === 'perfect') {
        conditionMultiplier *= 1.0;
    } else if (functionalCondition === 'minor') {
        conditionMultiplier *= 0.9;
    } else if (functionalCondition === 'issues') {
        conditionMultiplier *= 0.7;
    } else if (functionalCondition === 'broken') {
        conditionMultiplier *= 0.4;
    }
    
    // Calculate final price
    const finalPrice = Math.round(basePrice * conditionMultiplier);
    
    // Calculate price range (±5%)
    const minPrice = Math.round(finalPrice * 0.95);
    const maxPrice = Math.round(finalPrice * 1.05);
    
    // Update price display
    document.getElementById('estimate-price').textContent = `$${finalPrice}`;
    document.getElementById('price-range').textContent = `Price range: $${minPrice} - $${maxPrice}`;
    
    // Update hidden field for form submission
    document.getElementById('quote-amount').value = finalPrice;
}

function toggleDeliveryFields(deliveryMethod) {
    const storeFields = document.getElementById('store-fields');
    const mailFields = document.getElementById('mail-fields');
    
    if (deliveryMethod === 'store') {
        storeFields.style.display = 'block';
        mailFields.style.display = 'none';
    } else if (deliveryMethod === 'mail') {
        storeFields.style.display = 'none';
        mailFields.style.display = 'block';
    }
}

function generateBindingQuote() {
    // Hide the form
    document.getElementById('quote-form').style.display = 'none';
    
    // Show the quote certificate
    const certificateContainer = document.getElementById('quote-certificate');
    certificateContainer.style.display = 'block';
    
    // Get form values
    const deviceType = document.getElementById('selected-device').value;
    const brand = document.getElementById('brand-select').value;
    const model = document.getElementById('selected-model').value;
    const storage = document.getElementById('storage-select').value;
    const quoteAmount = document.getElementById('quote-amount').value;
    const email = document.getElementById('email-input').value;
    const phone = document.getElementById('phone-input').value;
    const validityDays = document.getElementById('quote-validity').value;
    
    // Generate a unique quote code
    const quoteCode = generateQuoteCode();
    
    // Calculate expiry date
    const expiryDate = calculateExpiryDate(parseInt(validityDays));
    
    // Update certificate with values
    document.getElementById('certificate-device').textContent = getDeviceDisplayName(deviceType, brand, model);
    document.getElementById('certificate-storage').textContent = getStorageDisplayName(storage);
    document.getElementById('certificate-price-value').textContent = `$${quoteAmount}`;
    document.getElementById('certificate-code-value').textContent = quoteCode;
    document.getElementById('certificate-expiry').textContent = formatDate(expiryDate);
    document.getElementById('certificate-email').textContent = email;
    
    // In a real implementation, this would send the quote details to the server
    // and also send an email to the customer
    
    // For demo purposes, we'll just scroll to the certificate
    certificateContainer.scrollIntoView({ behavior: 'smooth' });
}

function generateQuoteCode() {
    // Generate a random alphanumeric code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters like O, 0, 1, I
    let code = '';
    
    // First part: 3 letters
    for (let i = 0; i < 3; i++) {
        code += chars.charAt(Math.floor(Math.random() * 26)); // Only letters for first part
    }
    
    // Add separator
    code += '-';
    
    // Second part: 5 alphanumeric
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return code;
}

function calculateExpiryDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getDeviceDisplayName(deviceType, brand, model) {
    // This would be more comprehensive in a real implementation
    if (model.includes('iphone15pro')) {
        return 'Apple iPhone 15 Pro';
    } else if (model.includes('iphone14pro')) {
        return 'Apple iPhone 14 Pro';
    } else if (model.includes('galaxy-s23')) {
        return 'Samsung Galaxy S23';
    } else {
        return `${brand} ${model}`;
    }
}

function getStorageDisplayName(storage) {
    if (storage === '1tb') {
        return '1 TB';
    } else if (storage === '2tb') {
        return '2 TB';
    } else {
        return `${storage} GB`;
    }
}

function initTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        // Mobile support - touch events
        tooltip.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const tooltipText = this.querySelector('.tooltiptext');
            tooltipText.style.visibility = 'visible';
            tooltipText.style.opacity = '1';
            
            // Hide after 3 seconds
            setTimeout(() => {
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.opacity = '0';
            }, 3000);
        });
    });
}

function setupPrintFunctionality() {
    const printButton = document.getElementById('print-certificate');
    
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
}

// Add CSS class for form field validation styling
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .error {
            border-color: #ff3860 !important;
        }
        
        @media print {
            body * {
                visibility: hidden;
            }
            #quote-certificate, #quote-certificate * {
                visibility: visible;
            }
            #quote-certificate {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .print-button {
                display: none !important;
            }
        }
    </style>
`);
