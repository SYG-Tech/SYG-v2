/**
 * Appointment Scheduling System JavaScript
 * SellYourGadgets.com
 */

document.addEventListener('DOMContentLoaded', function() {
    // Store selected values
    let appointmentData = {
        location: null,
        locationName: '',
        date: null,
        time: null,
        devices: [],
        customer: {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            referralSource: '',
            specialRequests: '',
            smsConsent: false,
            marketingConsent: false
        }
    };

    // Step navigation functions
    function goToStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show selected step
        document.getElementById(`form-step-${stepNumber}`).classList.add('active');
        
        // Update step indicators
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        
        for (let i = 1; i < stepNumber; i++) {
            document.getElementById(`step-${i}`).classList.add('completed');
        }
        
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        
        // Scroll to top of form
        document.querySelector('.appointment-container').scrollIntoView({ behavior: 'smooth' });
    }

    // ===== STEP 1: LOCATION SELECTION =====
    const locationOptions = document.querySelectorAll('.location-option');
    const locationNextBtn = document.getElementById('location-next-btn');
    
    locationOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            locationOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Store selected location
            appointmentData.location = this.getAttribute('data-location-id');
            appointmentData.locationName = this.querySelector('h3').textContent;
            
            // Enable next button
            locationNextBtn.removeAttribute('disabled');
        });
    });
    
    locationNextBtn.addEventListener('click', function() {
        goToStep(2);
    });
    
    // Location search functionality
    const locationSearch = document.getElementById('location-search');
    const searchLocationBtn = document.getElementById('search-location-btn');
    
    function searchLocations() {
        const searchTerm = locationSearch.value.toLowerCase();
        
        if (searchTerm.length < 2) return;
        
        locationOptions.forEach(option => {
            const locationText = option.textContent.toLowerCase();
            const locationVisible = locationText.includes(searchTerm);
            
            option.style.display = locationVisible ? 'block' : 'none';
        });
    }
    
    searchLocationBtn.addEventListener('click', searchLocations);
    
    locationSearch.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchLocations();
        }
    });

    // ===== STEP 2: DATE & TIME SELECTION =====
    const datetimeBackBtn = document.getElementById('datetime-back-btn');
    const datetimeNextBtn = document.getElementById('datetime-next-btn');
    const selectedDateElement = document.getElementById('selected-date');
    const calendarDaysContainer = document.getElementById('calendar-days');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const timeSlots = document.querySelectorAll('.time-slot');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;
    
    // Generate calendar days
    function generateCalendar(month, year) {
        // Clear previous days
        while (calendarDaysContainer.children.length > 7) {
            calendarDaysContainer.removeChild(calendarDaysContainer.lastChild);
        }
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day disabled';
            calendarDaysContainer.appendChild(emptyDay);
        }
        
        // Add days of month
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = i;
            
            // Check if date is in the past
            const currentDateCheck = new Date(year, month, i);
            currentDateCheck.setHours(0, 0, 0, 0);
            
            if (currentDateCheck < today) {
                dayElement.classList.add('disabled');
            } else {
                // Add availability indicator (this would come from backend in real implementation)
                if (Math.random() > 0.2) { // 80% chance of availability for demo
                    dayElement.classList.add('has-availability');
                    
                    // Make day selectable
                    dayElement.addEventListener('click', function() {
                        // Remove selected class from all days
                        document.querySelectorAll('.calendar-day').forEach(day => {
                            day.classList.remove('selected');
                        });
                        
                        // Add selected class to clicked day
                        this.classList.add('selected');
                        
                        // Store selected date
                        selectedDate = new Date(year, month, i);
                        appointmentData.date = selectedDate;
                        
                        // Update selected date display
                        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                        selectedDateElement.textContent = selectedDate.toLocaleDateString('en-US', options);
                        
                        // Generate time slots for selected date
                        generateTimeSlots(selectedDate);
                    });
                } else {
                    dayElement.classList.add('disabled');
                }
            }
            
            calendarDaysContainer.appendChild(dayElement);
        }
    }
    
    // Generate time slots for selected date
    function generateTimeSlots(date) {
        // In a real implementation, available time slots would be fetched from backend
        // For demo purposes, we're using the existing time slots
        
        // Reset time slots
        timeSlots.forEach(slot => {
            slot.classList.remove('selected', 'disabled');
            
            // Randomly disable some slots for demo
            if (Math.random() < 0.3) {
                slot.classList.add('disabled');
            }
            
            // Add click handler to available slots
            if (!slot.classList.contains('disabled')) {
                slot.addEventListener('click', function() {
                    // Remove selected class from all slots
                    timeSlots.forEach(s => s.classList.remove('selected'));
                    
                    // Add selected class to clicked slot
                    this.classList.add('selected');
                    
                    // Store selected time
                    appointmentData.time = this.textContent;
                    
                    // Enable next button
                    datetimeNextBtn.removeAttribute('disabled');
                });
            }
        });
    }
    
    // Initialize calendar
    generateCalendar(currentMonth, currentYear);
    
    // Month navigation
    prevMonthBtn.addEventListener('click', function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    nextMonthBtn.addEventListener('click', function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // Step navigation
    datetimeBackBtn.addEventListener('click', function() {
        goToStep(1);
    });
    
    datetimeNextBtn.addEventListener('click', function() {
        goToStep(3);
    });

    // ===== STEP 3: DEVICE INFORMATION =====
    const deviceBackBtn = document.getElementById('device-back-btn');
    const deviceNextBtn = document.getElementById('device-next-btn');
    const deviceTypeSelect = document.getElementById('device-type');
    const deviceBrandSelect = document.getElementById('device-brand');
    const deviceModelSelect = document.getElementById('device-model');
    const conditionRadios = document.querySelectorAll('input[name="condition"]');
    const addDeviceBtn = document.getElementById('add-device-btn');
    const deviceList = document.getElementById('device-list');
    const addAnotherDeviceBtn = document.getElementById('add-another-device-btn');
    const estimatedValueContainer = document.getElementById('estimated-value-container');
    const estimatedValueElement = document.getElementById('estimated-value');
    
    // Device database (simplified for demo)
    const deviceDatabase = {
        smartphone: {
            brands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola', 'LG'],
            models: {
                'Apple': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone SE'],
                'Samsung': ['Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy S22', 'Galaxy S21', 'Galaxy Z Fold 4', 'Galaxy Z Flip 4', 'Galaxy A53'],
                'Google': ['Pixel 7 Pro', 'Pixel 7', 'Pixel 6a', 'Pixel 6', 'Pixel 5'],
                'OnePlus': ['OnePlus 10 Pro', 'OnePlus 10T', 'OnePlus 9', 'OnePlus 8T', 'OnePlus Nord'],
                'Xiaomi': ['Xiaomi 12 Pro', 'Xiaomi 12', 'Xiaomi 11T Pro', 'Redmi Note 11'],
                'Motorola': ['Moto G Power', 'Moto G Stylus', 'Moto Edge+', 'Razr'],
                'LG': ['LG V60 ThinQ', 'LG Velvet', 'LG Wing', 'LG G8 ThinQ']
            }
        },
        tablet: {
            brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Amazon'],
            models: {
                'Apple': ['iPad Pro 12.9"', 'iPad Pro 11"', 'iPad Air', 'iPad (10th gen)', 'iPad mini'],
                'Samsung': ['Galaxy Tab S8 Ultra', 'Galaxy Tab S8+', 'Galaxy Tab S8', 'Galaxy Tab A8'],
                'Microsoft': ['Surface Pro 9', 'Surface Pro 8', 'Surface Go 3'],
                'Lenovo': ['Tab P12 Pro', 'Tab P11 Pro', 'Tab M10'],
                'Amazon': ['Fire HD 10', 'Fire HD 8', 'Fire 7']
            }
        },
        laptop: {
            brands: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Microsoft'],
            models: {
                'Apple': ['MacBook Pro 16"', 'MacBook Pro 14"', 'MacBook Pro 13"', 'MacBook Air M2', 'MacBook Air M1'],
                'Dell': ['XPS 15', 'XPS 13', 'Inspiron 15', 'Inspiron 14', 'Latitude 14'],
                'HP': ['Spectre x360', 'Envy 13', 'Pavilion 15', 'EliteBook 840', 'Omen 16'],
                'Lenovo': ['ThinkPad X1 Carbon', 'ThinkPad T14', 'Yoga 9i', 'IdeaPad Slim 7'],
                'Asus': ['ROG Zephyrus G14', 'ZenBook 14', 'VivoBook 15', 'TUF Gaming A15'],
                'Acer': ['Swift 5', 'Aspire 5', 'Predator Helios 300', 'Chromebook Spin 713'],
                'Microsoft': ['Surface Laptop 5', 'Surface Laptop 4', 'Surface Laptop Studio', 'Surface Laptop Go 2']
            }
        }
    };
    
    // Update brand options based on device type
    deviceTypeSelect.addEventListener('change', function() {
        const deviceType = this.value;
        
        // Clear brand and model selects
        deviceBrandSelect.innerHTML = '<option value="">Select Brand</option>';
        deviceModelSelect.innerHTML = '<option value="">Select Model</option>';
        
        if (deviceType && deviceDatabase[deviceType]) {
            // Add brand options
            deviceDatabase[deviceType].brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                deviceBrandSelect.appendChild(option);
            });
        }
    });
    
    // Update model options based on brand
    deviceBrandSelect.addEventListener('change', function() {
        const deviceType = deviceTypeSelect.value;
        const brand = this.value;
        
        // Clear model select
        deviceModelSelect.innerHTML = '<option value="">Select Model</option>';
        
        if (deviceType && brand && deviceDatabase[deviceType] && deviceDatabase[deviceType].models[brand]) {
            // Add model options
            deviceDatabase[deviceType].models[brand].forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                deviceModelSelect.appendChild(option);
            });
        }
    });
    
    // Add device to list
    addDeviceBtn.addEventListener('click', function() {
        const deviceType = deviceTypeSelect.value;
        const brand = deviceBrandSelect.value;
        const model = deviceModelSelect.value;
        let condition = '';
        
        // Get selected condition
        conditionRadios.forEach(radio => {
            if (radio.checked) {
                condition = radio.value;
            }
        });
        
        // Validate inputs
        if (!deviceType || !brand || !model || !condition) {
            alert('Please complete all device information fields');
            return;
        }
        
        // Generate estimated value (in real implementation, this would come from backend)
        const baseValues = {
            'smartphone': { 'new': 800, 'excellent': 600, 'good': 400, 'fair': 200, 'broken': 100, 'parts': 50 },
            'tablet': { 'new': 600, 'excellent': 450, 'good': 300, 'fair': 150, 'broken': 75, 'parts': 30 },
            'laptop': { 'new': 1200, 'excellent': 900, 'good': 600, 'fair': 300, 'broken': 150, 'parts': 75 }
        };
        
        // Calculate value with some randomization
        let baseValue = baseValues[deviceType] ? baseValues[deviceType][condition] : 100;
        const randomFactor = 0.8 + (Math.random() * 0.4); // Random factor between 0.8 and 1.2
        const estimatedValue = Math.round(baseValue * randomFactor);
        
        // Create device object
        const device = {
            type: deviceType,
            brand: brand,
            model: model,
            condition: condition,
            estimatedValue: estimatedValue
        };
        
        // Add to device array
        appointmentData.devices.push(device);
        
        // Create device item element
        const deviceItem = document.createElement('div');
        deviceItem.className = 'device-item';
        deviceItem.innerHTML = `
            <div class="device-item-header">
                <div class="device-item-title">${brand} ${model}</div>
                <div class="device-item-value">$${estimatedValue}</div>
            </div>
            <div>${getDeviceTypeLabel(deviceType)} • ${getConditionLabel(condition)}</div>
            <button type="button" class="device-item-remove" data-index="${appointmentData.devices.length - 1}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to device list
        deviceList.appendChild(deviceItem);
        
        // Show estimated value container
        estimatedValueContainer.style.display = 'block';
        
        // Update total estimated value
        updateEstimatedValue();
        
        // Enable next button if at least one device added
        deviceNextBtn.removeAttribute('disabled');
        
        // Reset form
        deviceTypeSelect.value = '';
        deviceBrandSelect.innerHTML = '<option value="">Select Brand</option>';
        deviceModelSelect.innerHTML = '<option value="">Select Model</option>';
        conditionRadios.forEach(radio => {
            radio.checked = false;
        });
    });
    
    // Helper functions for labels
    function getDeviceTypeLabel(type) {
        const labels = {
            'smartphone': 'Smartphone',
            'tablet': 'Tablet',
            'laptop': 'Laptop',
            'desktop': 'Desktop Computer',
            'gaming': 'Gaming Console',
            'camera': 'Camera',
            'drone': 'Drone',
            'smartwatch': 'Smartwatch',
            'audio': 'Audio Equipment',
            'tools': 'Power Tools',
            'other': 'Other Electronics'
        };
        return labels[type] || type;
    }
    
    function getConditionLabel(condition) {
        const labels = {
            'new': 'New/Like New',
            'excellent': 'Excellent',
            'good': 'Good',
            'fair': 'Fair',
            'broken': 'Broken',
            'parts': 'For Parts'
        };
        return labels[condition] || condition;
    }
    
    // Update total estimated value
    function updateEstimatedValue() {
        let total = 0;
        appointmentData.devices.forEach(device => {
            total += device.estimatedValue;
        });
        estimatedValueElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Remove device from list
    deviceList.addEventListener('click', function(e) {
        if (e.target.closest('.device-item-remove')) {
            const button = e.target.closest('.device-item-remove');
            const index = parseInt(button.getAttribute('data-index'));
            
            // Remove from array
            appointmentData.devices.splice(index, 1);
            
            // Remove from DOM
            button.closest('.device-item').remove();
            
            // Update indices of remaining buttons
            document.querySelectorAll('.device-item-remove').forEach((btn, i) => {
                btn.setAttribute('data-index', i);
            });
            
            // Update total estimated value
            updateEstimatedValue();
            
            // Disable next button if no devices
            if (appointmentData.devices.length === 0) {
                deviceNextBtn.setAttribute('disabled', 'disabled');
                estimatedValueContainer.style.display = 'none';
            }
        }
    });
    
    // Add another device button
    addAnotherDeviceBtn.addEventListener('click', function() {
        // Reset form to add another device
        deviceTypeSelect.value = '';
        deviceBrandSelect.innerHTML = '<option value="">Select Brand</option>';
        deviceModelSelect.innerHTML = '<option value="">Select Model</option>';
        conditionRadios.forEach(radio => {
            radio.checked = false;
        });
    });
    
    // Step navigation
    deviceBackBtn.addEventListener('click', function() {
        goToStep(2);
    });
    
    deviceNextBtn.addEventListener('click', function() {
        goToStep(4);
    });

    // ===== STEP 4: CUSTOMER INFORMATION =====
    const customerBackBtn = document.getElementById('customer-back-btn');
    const customerNextBtn = document.getElementById('customer-next-btn');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const referralSourceSelect = document.getElementById('referral-source');
    const specialRequestsTextarea = document.getElementById('special-requests');
    const smsConsentCheckbox = document.getElementById('sms-consent');
    const marketingConsentCheckbox = document.getElementById('marketing-consent');
    
    // Validate customer form
    function validateCustomerForm() {
        if (firstNameInput.value && lastNameInput.value && phoneInput.value && emailInput.value) {
            customerNextBtn.removeAttribute('disabled');
        } else {
            customerNextBtn.setAttribute('disabled', 'disabled');
        }
    }
    
    // Add input event listeners to all required fields
    [firstNameInput, lastNameInput, phoneInput, emailInput].forEach(input => {
        input.addEventListener('input', validateCustomerForm);
    });
    
    // Store customer data on form submission
    customerNextBtn.addEventListener('click', function() {
        // Store customer data
        appointmentData.customer = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            referralSource: referralSourceSelect.value,
            specialRequests: specialRequestsTextarea.value,
            smsConsent: smsConsentCheckbox.checked,
            marketingConsent: marketingConsentCheckbox.checked
        };
        
        // Update confirmation screen
        document.getElementById('confirm-location').textContent = appointmentData.locationName;
        
        // Format date and time
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = appointmentData.date.toLocaleDateString('en-US', options);
        document.getElementById('confirm-datetime').textContent = `${formattedDate} at ${appointmentData.time}`;
        
        // Generate random appointment ID
        const appointmentId = 'APT-' + Math.floor(10000 + Math.random() * 90000);
        document.getElementById('confirm-id').textContent = appointmentId;
        
        // Calculate total value
        let total = 0;
        appointmentData.devices.forEach(device => {
            total += device.estimatedValue;
        });
        document.getElementById('confirm-value').textContent = `$${total.toFixed(2)}`;
        
        // Go to confirmation step
        goToStep(5);
        
        // In a real implementation, this is where you would send the data to the server
        console.log('Appointment Data:', appointmentData);
    });
    
    // Step navigation
    customerBackBtn.addEventListener('click', function() {
        goToStep(3);
    });

    // ===== STEP 5: CONFIRMATION =====
    // Add to calendar functionality
    document.getElementById('add-to-calendar-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // In a real implementation, this would generate a calendar file
        alert('Calendar invite would be generated here. For demo purposes, this feature is simulated.');
    });
});
