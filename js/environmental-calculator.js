// Environmental Impact Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculator
    initCalculator();
});

function initCalculator() {
    // Set up form submission
    const calculatorForm = document.getElementById('calculator-form');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateEnvironmentalImpact();
        });
    }
    
    // Set up quantity controls
    initQuantityControls();
    
    // Set up device selection change handlers
    initDeviceSelectionHandlers();
    
    // Set up tooltips
    initTooltips();
    
    // Set up share buttons
    initShareButtons();
}

// Initialize quantity control buttons
function initQuantityControls() {
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('device-quantity');
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value) || 0;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value) || 0;
            quantityInput.value = currentValue + 1;
        });
        
        // Ensure quantity is always at least 1
        quantityInput.addEventListener('change', function() {
            if (this.value < 1) {
                this.value = 1;
            }
        });
    }
}

// Initialize device selection handlers
function initDeviceSelectionHandlers() {
    const deviceTypeSelect = document.getElementById('device-type');
    const deviceBrandSelect = document.getElementById('device-brand');
    
    if (deviceTypeSelect && deviceBrandSelect) {
        // Update brand options when device type changes
        deviceTypeSelect.addEventListener('change', function() {
            updateBrandOptions(this.value);
        });
        
        // Update model options when brand changes
        deviceBrandSelect.addEventListener('change', function() {
            updateModelOptions(deviceTypeSelect.value, this.value);
        });
        
        // Initialize with default values
        updateBrandOptions(deviceTypeSelect.value);
    }
}

// Update brand dropdown based on device type
function updateBrandOptions(deviceType) {
    const brandSelect = document.getElementById('device-brand');
    
    if (!brandSelect) return;
    
    // Clear current options
    brandSelect.innerHTML = '<option value="">Select Brand</option>';
    
    // Add new options based on device type
    const brands = getDeviceBrands(deviceType);
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.toLowerCase().replace(/\s+/g, '-');
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
    
    // Trigger model update
    updateModelOptions(deviceType, '');
}

// Update model dropdown based on device type and brand
function updateModelOptions(deviceType, brand) {
    const modelSelect = document.getElementById('device-model');
    
    if (!modelSelect) return;
    
    // Clear current options
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    
    if (!brand) return;
    
    // Add new options based on device type and brand
    const models = getDeviceModels(deviceType, brand);
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.toLowerCase().replace(/\s+/g, '-');
        option.textContent = model;
        modelSelect.appendChild(option);
    });
}

// Get brands for a device type
function getDeviceBrands(deviceType) {
    const brandMap = {
        'smartphone': ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola', 'LG', 'Sony'],
        'tablet': ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Amazon', 'Huawei', 'Google'],
        'laptop': ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Microsoft', 'Acer', 'MSI'],
        'desktop': ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Microsoft', 'Acer', 'Custom Build'],
        'gaming-console': ['Sony', 'Microsoft', 'Nintendo', 'Other'],
        'wearable': ['Apple', 'Samsung', 'Fitbit', 'Garmin', 'Fossil', 'Xiaomi', 'Huawei'],
        'camera': ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic', 'Olympus', 'GoPro'],
        'audio': ['Apple', 'Sony', 'Bose', 'Samsung', 'JBL', 'Sennheiser', 'Beats', 'Sonos']
    };
    
    return brandMap[deviceType] || [];
}

// Get models for a device type and brand
function getDeviceModels(deviceType, brand) {
    // This is a simplified version - in a real implementation, 
    // this would likely fetch data from a server or use a more comprehensive dataset
    
    const modelMap = {
        'smartphone': {
            'apple': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 
                     'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
                     'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 Mini',
                     'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 Mini',
                     'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11', 'iPhone XS Max',
                     'iPhone XS', 'iPhone XR', 'iPhone X', 'iPhone 8 Plus', 'iPhone 8', 'Other'],
            'samsung': ['Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 
                       'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
                       'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21',
                       'Galaxy Z Fold4', 'Galaxy Z Flip4', 'Galaxy Z Fold3', 'Galaxy Z Flip3',
                       'Galaxy Note 20 Ultra', 'Galaxy Note 20', 'Galaxy A53', 'Galaxy A33', 'Other'],
            'google': ['Pixel 7 Pro', 'Pixel 7', 'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a', 
                      'Pixel 5', 'Pixel 4 XL', 'Pixel 4', 'Pixel 4a', 'Pixel 3 XL', 'Pixel 3', 'Other']
        },
        'tablet': {
            'apple': ['iPad Pro 12.9" (6th gen)', 'iPad Pro 11" (4th gen)', 'iPad Air (5th gen)', 
                     'iPad (10th gen)', 'iPad mini (6th gen)', 'iPad Pro 12.9" (5th gen)', 
                     'iPad Pro 11" (3rd gen)', 'iPad (9th gen)', 'Other'],
            'samsung': ['Galaxy Tab S8 Ultra', 'Galaxy Tab S8+', 'Galaxy Tab S8', 
                       'Galaxy Tab S7+', 'Galaxy Tab S7', 'Galaxy Tab A8', 'Galaxy Tab A7', 'Other']
        },
        'laptop': {
            'apple': ['MacBook Pro 16" (M2)', 'MacBook Pro 14" (M2)', 'MacBook Pro 13" (M2)', 
                     'MacBook Air (M2)', 'MacBook Pro 16" (M1)', 'MacBook Pro 14" (M1)', 
                     'MacBook Pro 13" (M1)', 'MacBook Air (M1)', 'Other'],
            'dell': ['XPS 15', 'XPS 13', 'XPS 17', 'Inspiron 15', 'Inspiron 14', 
                    'Latitude 14', 'Precision 15', 'Alienware m15', 'Alienware x17', 'Other']
        }
    };
    
    // If we have specific models for this device type and brand, return them
    if (modelMap[deviceType] && modelMap[deviceType][brand]) {
        return modelMap[deviceType][brand];
    }
    
    // Otherwise return a generic list
    return ['Base Model', 'Mid-range Model', 'Premium Model', 'Other'];
}

// Calculate environmental impact based on form inputs
function calculateEnvironmentalImpact() {
    // Get form values
    const deviceType = document.getElementById('device-type').value;
    const deviceBrand = document.getElementById('device-brand').value;
    const deviceModel = document.getElementById('device-model').value;
    const deviceCondition = document.getElementById('device-condition').value;
    const deviceQuantity = parseInt(document.getElementById('device-quantity').value) || 1;
    
    // Validate inputs
    if (!deviceType || !deviceBrand || !deviceModel || !deviceCondition) {
        showError('Please fill in all fields to calculate environmental impact.');
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Simulate calculation delay (would be a server call in a real implementation)
    setTimeout(() => {
        // Calculate impact
        const impactData = calculateImpactData(deviceType, deviceBrand, deviceModel, deviceCondition, deviceQuantity);
        
        // Display results
        displayResults(impactData);
        
        // Hide loading state
        hideLoading();
        
        // Scroll to results
        document.getElementById('calculator-results').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('calculator-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

// Show loading state
function showLoading() {
    const loadingElement = document.getElementById('calculator-loading');
    const formElement = document.getElementById('calculator-form');
    const resultsElement = document.getElementById('calculator-results');
    
    if (loadingElement) loadingElement.style.display = 'block';
    if (formElement) formElement.style.opacity = '0.5';
    if (resultsElement) resultsElement.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    const loadingElement = document.getElementById('calculator-loading');
    const formElement = document.getElementById('calculator-form');
    
    if (loadingElement) loadingElement.style.display = 'none';
    if (formElement) formElement.style.opacity = '1';
}

// Calculate impact data based on device information
function calculateImpactData(deviceType, deviceBrand, deviceModel, deviceCondition, quantity) {
    // This is a simplified calculation model
    // In a real implementation, this would use more accurate data from research studies
    
    // Base impact values by device type (per device)
    const baseImpact = {
        'smartphone': {
            co2: 80, // kg of CO2
            energy: 60, // kWh
            water: 13000, // liters
            materials: 1.2, // kg
            ewaste: 0.15 // kg
        },
        'tablet': {
            co2: 100,
            energy: 75,
            water: 18000,
            materials: 1.5,
            ewaste: 0.3
        },
        'laptop': {
            co2: 300,
            energy: 200,
            water: 52000,
            materials: 3.5,
            ewaste: 2.5
        },
        'desktop': {
            co2: 500,
            energy: 350,
            water: 70000,
            materials: 9,
            ewaste: 8
        },
        'gaming-console': {
            co2: 150,
            energy: 120,
            water: 25000,
            materials: 2.8,
            ewaste: 2.2
        },
        'wearable': {
            co2: 30,
            energy: 20,
            water: 5000,
            materials: 0.3,
            ewaste: 0.05
        },
        'camera': {
            co2: 80,
            energy: 50,
            water: 12000,
            materials: 0.8,
            ewaste: 0.3
        },
        'audio': {
            co2: 40,
            energy: 30,
            water: 7000,
            materials: 0.5,
            ewaste: 0.2
        }
    };
    
    // Get base impact for device type
    const impact = baseImpact[deviceType] || baseImpact.smartphone;
    
    // Apply brand and model adjustments (premium devices have higher impact)
    let brandFactor = 1.0;
    if (deviceBrand === 'apple' || deviceBrand === 'samsung' || 
        deviceModel.includes('pro') || deviceModel.includes('premium') || 
        deviceModel.includes('ultra')) {
        brandFactor = 1.2;
    }
    
    // Apply condition adjustment (better condition means more of the device can be reused)
    let conditionFactor = 1.0;
    switch (deviceCondition) {
        case 'like-new':
            conditionFactor = 1.0;
            break;
        case 'good':
            conditionFactor = 0.9;
            break;
        case 'fair':
            conditionFactor = 0.8;
            break;
        case 'poor':
            conditionFactor = 0.7;
            break;
        case 'broken':
            conditionFactor = 0.5;
            break;
    }
    
    // Calculate final impact values with all factors and quantity
    const finalImpact = {
        co2: Math.round(impact.co2 * brandFactor * conditionFactor * quantity),
        energy: Math.round(impact.energy * brandFactor * conditionFactor * quantity),
        water: Math.round(impact.water * brandFactor * conditionFactor * quantity),
        materials: (impact.materials * brandFactor * conditionFactor * quantity).toFixed(2),
        ewaste: (impact.ewaste * brandFactor * conditionFactor * quantity).toFixed(2)
    };
    
    // Calculate equivalencies
    const equivalencies = {
        treesPlanted: Math.round(finalImpact.co2 / 20), // 20kg CO2 per tree per year
        carMiles: Math.round(finalImpact.co2 * 4), // 0.25kg CO2 per mile
        homeEnergy: Math.round(finalImpact.energy / 30), // 30kWh per day for average home
        waterBottles: Math.round(finalImpact.water / 0.5), // 0.5 liters per bottle
        smartphones: Math.round(finalImpact.materials / 0.08) // 0.08kg rare materials per smartphone
    };
    
    return {
        impact: finalImpact,
        equivalencies: equivalencies,
        deviceInfo: {
            type: deviceType,
            brand: deviceBrand,
            model: deviceModel,
            condition: deviceCondition,
            quantity: quantity
        }
    };
}

// Display calculation results
function displayResults(impactData) {
    const resultsElement = document.getElementById('calculator-results');
    if (!resultsElement) return;
    
    // Show results section
    resultsElement.style.display = 'block';
    
    // Update summary text
    const summaryElement = document.querySelector('.summary-text');
    if (summaryElement) {
        const deviceInfo = impactData.deviceInfo;
        const deviceTypeDisplay = document.getElementById('device-type').options[document.getElementById('device-type').selectedIndex].text;
        const deviceBrandDisplay = document.getElementById('device-brand').options[document.getElementById('device-brand').selectedIndex].text;
        const deviceModelDisplay = document.getElementById('device-model').options[document.getElementById('device-model').selectedIndex].text;
        
        summaryElement.textContent = `By recycling ${deviceInfo.quantity} ${deviceBrandDisplay} ${deviceModelDisplay}, you're making a significant positive impact on the environment!`;
    }
    
    // Update impact metrics
    updateImpactMetric('co2-saved', impactData.impact.co2, 'kg');
    updateImpactMetric('energy-saved', impactData.impact.energy, 'kWh');
    updateImpactMetric('water-saved', Math.round(impactData.impact.water / 1000), 'gallons'); // Convert to gallons
    updateImpactMetric('materials-saved', impactData.impact.materials, 'kg');
    updateImpactMetric('ewaste-reduced', impactData.impact.ewaste, 'kg');
    
    // Update equivalencies
    updateEquivalency('trees-equivalent', impactData.equivalencies.treesPlanted, 'Trees Planted');
    updateEquivalency('car-equivalent', impactData.equivalencies.carMiles, 'Car Miles Not Driven');
    updateEquivalency('energy-equivalent', impactData.equivalencies.homeEnergy, 'Days of Home Energy');
    updateEquivalency('water-equivalent', impactData.equivalencies.waterBottles, 'Water Bottles Saved');
    
    // Animate progress bars
    animateProgressBars();
    
    // Update share links
    updateShareLinks(impactData);
}

// Update an impact metric with value and unit
function updateImpactMetric(elementId, value, unit) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
        
        // Update unit if there's a separate element for it
        const unitElement = document.getElementById(`${elementId}-unit`);
        if (unitElement) {
            unitElement.textContent = unit;
        }
    }
}

// Update an equivalency with value and label
function updateEquivalency(elementId, value, label) {
    const valueElement = document.getElementById(`${elementId}-value`);
    const labelElement = document.getElementById(`${elementId}-label`);
    
    if (valueElement) {
        valueElement.textContent = value.toLocaleString();
    }
    
    if (labelElement) {
        labelElement.textContent = label;
    }
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-target') || '100%';
        
        // Reset width first
        bar.style.width = '0%';
        
        // Animate to target width
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100);
    });
}

// Update share links with impact data
function updateShareLinks(impactData) {
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        const shareType = button.getAttribute('data-share');
        if (!shareType) return;
        
        const message = `I just discovered that by recycling my electronics with SellYourGadgets.com, I'm saving ${impactData.impact.co2} kg of CO2 and ${impactData.equivalencies.treesPlanted} trees! Check your impact:`;
        const url = window.location.href;
        
        let shareUrl;
        
        switch(shareType) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent('My Environmental Impact from Electronics Recycling')}&body=${encodeURIComponent(message + ' ' + url)}`;
                break;
        }
        
        button.setAttribute('data-url', shareUrl);
        
        // Add click event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        // Mobile support - add click handler
        tooltip.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Hide all other tooltip texts
            document.querySelectorAll('.tooltip-text').forEach(tt => {
                if (tt !== this.querySelector('.tooltip-text')) {
                    tt.style.visibility = 'hidden';
                    tt.style.opacity = '0';
                }
            });
            
            // Toggle this tooltip
            const tooltipText = this.querySelector('.tooltip-text');
            if (tooltipText) {
                if (tooltipText.style.visibility === 'visible') {
                    tooltipText.style.visibility = 'hidden';
                    tooltipText.style.opacity = '0';
                } else {
                    tooltipText.style.visibility = 'visible';
                    tooltipText.style.opacity = '1';
                }
            }
        });
    });
    
    // Close tooltips when clicking elsewhere
    document.addEventListener('click', function() {
        document.querySelectorAll('.tooltip-text').forEach(tt => {
            tt.style.visibility = 'hidden';
            tt.style.opacity = '0';
        });
    });
}

// Initialize share buttons
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Initialize certificate download
function initCertificateDownload() {
    const certificateButton = document.querySelector('.download-certificate');
    
    if (certificateButton) {
        certificateButton.addEventListener('click', function() {
            // In a real implementation, this would generate a PDF certificate
            alert('In a production environment, this would generate a personalized PDF certificate of your environmental impact.');
        });
    }
}
