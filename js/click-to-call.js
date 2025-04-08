/**
 * Click-to-Call Features JavaScript
 * SellYourGadgets.com
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create and append floating call button to the body
    function createFloatingCallButton() {
        const floatingButton = document.createElement('div');
        floatingButton.className = 'floating-call-button';
        floatingButton.innerHTML = `
            <div class="call-button-text">Call Now: 800-555-CASH</div>
            <div class="call-button-circle">
                <i class="fas fa-phone-alt"></i>
            </div>
        `;
        
        document.body.appendChild(floatingButton);
        
        // Add click event
        const callButtonCircle = floatingButton.querySelector('.call-button-circle');
        callButtonCircle.addEventListener('click', function() {
            handleCallButtonClick('floating-button');
        });
    }
    
    // Create and append questions widget to the body
    function createQuestionsWidget() {
        const questionsWidget = document.createElement('div');
        questionsWidget.className = 'questions-widget';
        questionsWidget.id = 'questions-widget';
        questionsWidget.innerHTML = `
            <div class="questions-widget-header">
                <h3 class="questions-widget-title">Have questions about selling your device?</h3>
                <button class="questions-widget-close" id="questions-widget-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="questions-widget-content">
                Our experts are ready to help you get the best value for your electronics.
            </div>
            <button class="questions-widget-call-btn" id="questions-widget-call-btn">
                <i class="fas fa-phone-alt"></i> Call Now
            </button>
            <a href="request-callback.html" class="questions-widget-callback">
                Request a Callback
            </a>
        `;
        
        document.body.appendChild(questionsWidget);
        
        // Add event listeners
        document.getElementById('questions-widget-close').addEventListener('click', function() {
            hideQuestionsWidget(true);
        });
        
        document.getElementById('questions-widget-call-btn').addEventListener('click', function() {
            handleCallButtonClick('questions-widget');
        });
    }
    
    // Show questions widget after delay
    function showQuestionsWidget() {
        // Check if user has dismissed the widget in this session
        if (sessionStorage.getItem('widgetDismissed') === 'true') {
            return;
        }
        
        const questionsWidget = document.getElementById('questions-widget');
        if (questionsWidget) {
            questionsWidget.classList.add('active');
        }
    }
    
    // Hide questions widget
    function hideQuestionsWidget(remember = false) {
        const questionsWidget = document.getElementById('questions-widget');
        if (questionsWidget) {
            questionsWidget.classList.remove('active');
            
            if (remember) {
                // Remember that user dismissed the widget in this session
                sessionStorage.setItem('widgetDismissed', 'true');
            }
        }
    }
    
    // Handle call button clicks
    function handleCallButtonClick(source) {
        // Log the call attempt for analytics
        logCallAttempt(source);
        
        // Check if mobile device
        if (isMobileDevice()) {
            // Initiate call on mobile
            window.location.href = 'tel:8005552274';
        } else {
            // On desktop, show number with copy option
            showDesktopCallPrompt();
        }
    }
    
    // Check if user is on a mobile device
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Show desktop call prompt
    function showDesktopCallPrompt() {
        // Create modal if it doesn't exist
        if (!document.getElementById('desktop-call-modal')) {
            const modal = document.createElement('div');
            modal.id = 'desktop-call-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '2000';
            
            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = 'white';
            modalContent.style.borderRadius = '8px';
            modalContent.style.padding = '2rem';
            modalContent.style.maxWidth = '400px';
            modalContent.style.width = '90%';
            modalContent.style.textAlign = 'center';
            
            modalContent.innerHTML = `
                <h3 style="margin-top: 0;">Call SellYourGadgets.com</h3>
                <p>Our experts are ready to help you get the best value for your electronics.</p>
                <div style="font-size: 24px; font-weight: bold; margin: 1.5rem 0; color: var(--primary);">
                    800-555-CASH
                </div>
                <button id="copy-number-btn" style="background-color: var(--primary); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; font-weight: 600; cursor: pointer; margin-bottom: 1rem;">
                    <i class="fas fa-copy"></i> Copy Number
                </button>
                <p style="margin-bottom: 0;">
                    <a href="request-callback.html" style="color: var(--primary);">
                        Request a Callback Instead
                    </a>
                </p>
                <button id="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Add event listeners
            document.getElementById('copy-number-btn').addEventListener('click', function() {
                navigator.clipboard.writeText('800-555-CASH').then(function() {
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-copy"></i> Copy Number';
                    }, 2000);
                }.bind(this));
            });
            
            document.getElementById('close-modal-btn').addEventListener('click', function() {
                document.getElementById('desktop-call-modal').style.display = 'none';
            });
        } else {
            // Show existing modal
            document.getElementById('desktop-call-modal').style.display = 'flex';
        }
    }
    
    // Log call attempt for analytics
    function logCallAttempt(source) {
        // In a real implementation, this would send data to analytics
        console.log('Call attempt from:', source, 'Page:', window.location.pathname, 'Time:', new Date().toISOString());
        
        // Store in localStorage for basic tracking
        const callAttempts = JSON.parse(localStorage.getItem('callAttempts') || '[]');
        callAttempts.push({
            source: source,
            page: window.location.pathname,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('callAttempts', JSON.stringify(callAttempts));
    }
    
    // Initialize callback form if it exists on the page
    function initCallbackForm() {
        const callbackForm = document.getElementById('callback-form');
        if (!callbackForm) return;
        
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                firstName: document.getElementById('callback-first-name').value,
                lastName: document.getElementById('callback-last-name').value,
                phone: document.getElementById('callback-phone').value,
                email: document.getElementById('callback-email').value,
                bestTime: document.getElementById('callback-best-time').value,
                deviceInfo: document.getElementById('callback-device-info').value,
                message: document.getElementById('callback-message').value
            };
            
            // Validate form
            if (!formData.firstName || !formData.lastName || !formData.phone) {
                alert('Please fill out all required fields');
                return;
            }
            
            // In a real implementation, this would send data to server
            console.log('Callback request:', formData);
            
            // Store in localStorage for demo
            const callbackRequests = JSON.parse(localStorage.getItem('callbackRequests') || '[]');
            callbackRequests.push({
                ...formData,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });
            localStorage.setItem('callbackRequests', JSON.stringify(callbackRequests));
            
            // Show confirmation
            showCallbackConfirmation(formData);
        });
    }
    
    // Show callback confirmation
    function showCallbackConfirmation(formData) {
        const callbackFormContainer = document.querySelector('.callback-form-container');
        if (!callbackFormContainer) return;
        
        // Generate confirmation ID
        const confirmationId = 'CB-' + Math.floor(10000 + Math.random() * 90000);
        
        // Determine callback time based on selection
        let callbackTimeText = 'Within 24 hours';
        if (formData.bestTime === 'morning') {
            callbackTimeText = 'Between 9am and 12pm tomorrow';
        } else if (formData.bestTime === 'afternoon') {
            callbackTimeText = 'Between 12pm and 5pm tomorrow';
        } else if (formData.bestTime === 'evening') {
            callbackTimeText = 'Between 5pm and 8pm tomorrow';
        }
        
        // Replace form with confirmation
        callbackFormContainer.innerHTML = `
            <div class="callback-confirmation">
                <div class="callback-confirmation-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 class="callback-confirmation-title">Your Callback Request is Confirmed!</h2>
                <p class="callback-confirmation-message">
                    One of our experts will call you at the requested time. Please keep your phone handy.
                </p>
                
                <div class="callback-confirmation-details">
                    <div class="callback-confirmation-detail">
                        <div class="callback-confirmation-label">Name:</div>
                        <div>${formData.firstName} ${formData.lastName}</div>
                    </div>
                    <div class="callback-confirmation-detail">
                        <div class="callback-confirmation-label">Phone:</div>
                        <div>${formData.phone}</div>
                    </div>
                    <div class="callback-confirmation-detail">
                        <div class="callback-confirmation-label">Expected Callback:</div>
                        <div>${callbackTimeText}</div>
                    </div>
                    <div class="callback-confirmation-detail">
                        <div class="callback-confirmation-label">Request ID:</div>
                        <div>${confirmationId}</div>
                    </div>
                </div>
                
                <p>
                    Need to make changes? Call us at 800-555-CASH and reference your Request ID.
                </p>
                
                <a href="index.html" class="btn btn-primary">
                    <i class="fas fa-home"></i> Return to Homepage
                </a>
            </div>
        `;
    }
    
    // Enhance location phone numbers if on location page
    function enhanceLocationPhones() {
        const locationCards = document.querySelectorAll('.location-card');
        if (locationCards.length === 0) return;
        
        locationCards.forEach(card => {
            const phoneElement = card.querySelector('.location-info p:nth-child(2)');
            if (!phoneElement) return;
            
            const phoneText = phoneElement.textContent;
            const phoneNumber = phoneText.replace(/\D/g, '');
            
            // Add call button
            const callButton = document.createElement('a');
            callButton.className = 'location-call-button';
            callButton.href = isMobileDevice() ? `tel:${phoneNumber}` : '#';
            callButton.innerHTML = '<i class="fas fa-phone-alt"></i> Call This Location';
            
            if (!isMobileDevice()) {
                callButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    showDesktopCallPrompt();
                });
            }
            
            card.querySelector('.location-content').appendChild(callButton);
        });
    }
    
    // Add phone number to header if not on mobile
    function addHeaderPhone() {
        if (window.innerWidth < 992) return;
        
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        const phoneElement = document.createElement('div');
        phoneElement.className = 'enhanced-phone header-phone';
        phoneElement.innerHTML = '<i class="fas fa-phone-alt"></i> 800-555-CASH';
        
        // Insert before hamburger
        const hamburger = navbar.querySelector('.hamburger');
        navbar.insertBefore(phoneElement, hamburger);
        
        // Add click event
        phoneElement.addEventListener('click', function() {
            if (isMobileDevice()) {
                window.location.href = 'tel:8005552274';
            } else {
                showDesktopCallPrompt();
            }
        });
    }
    
    // Initialize all click-to-call features
    function initClickToCall() {
        createFloatingCallButton();
        createQuestionsWidget();
        addHeaderPhone();
        enhanceLocationPhones();
        initCallbackForm();
        
        // Show questions widget after 30 seconds
        setTimeout(showQuestionsWidget, 30000);
    }
    
    // Initialize everything
    initClickToCall();
    
    // Enhance all call buttons on the page
    document.querySelectorAll('.call-button, [href^="tel:"]').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!isMobileDevice() && !this.classList.contains('force-tel')) {
                e.preventDefault();
                showDesktopCallPrompt();
                logCallAttempt('inline-button');
            } else {
                logCallAttempt('inline-button-mobile');
            }
        });
    });
});
