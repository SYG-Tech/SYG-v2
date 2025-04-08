/**
 * User Data Collection System
 * SellYourGadgets.com
 * 
 * This script integrates data collection across appointment scheduling and click-to-call features
 */

// Initialize the user data collection system
const UserDataCollection = (function() {
    // Private variables
    let userData = {
        visits: [],
        interactions: [],
        leads: [],
        appointments: [],
        callbacks: []
    };
    
    // Load existing data from localStorage
    function loadData() {
        const storedData = localStorage.getItem('sellYourGadgets_userData');
        if (storedData) {
            try {
                userData = JSON.parse(storedData);
            } catch (e) {
                console.error('Error parsing stored user data:', e);
            }
        }
    }
    
    // Save data to localStorage
    function saveData() {
        try {
            localStorage.setItem('sellYourGadgets_userData', JSON.stringify(userData));
        } catch (e) {
            console.error('Error saving user data:', e);
        }
    }
    
    // Generate a unique ID
    function generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Get user's current session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem('sellYourGadgets_sessionId');
        if (!sessionId) {
            sessionId = generateId();
            sessionStorage.setItem('sellYourGadgets_sessionId', sessionId);
        }
        return sessionId;
    }
    
    // Track page visit
    function trackVisit() {
        const visit = {
            id: generateId(),
            sessionId: getSessionId(),
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        };
        
        userData.visits.push(visit);
        saveData();
    }
    
    // Track user interaction
    function trackInteraction(type, details) {
        const interaction = {
            id: generateId(),
            sessionId: getSessionId(),
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            type: type,
            details: details
        };
        
        userData.interactions.push(interaction);
        saveData();
    }
    
    // Store lead information
    function storeLead(source, data) {
        const lead = {
            id: generateId(),
            sessionId: getSessionId(),
            timestamp: new Date().toISOString(),
            source: source,
            data: data,
            status: 'new'
        };
        
        userData.leads.push(lead);
        saveData();
        
        // Return the lead ID for reference
        return lead.id;
    }
    
    // Store appointment information
    function storeAppointment(appointmentData) {
        const appointment = {
            id: generateId(),
            sessionId: getSessionId(),
            timestamp: new Date().toISOString(),
            data: appointmentData,
            status: 'scheduled'
        };
        
        userData.appointments.push(appointment);
        saveData();
        
        // Also store as a lead for follow-up
        storeLead('appointment', {
            name: `${appointmentData.customer.firstName} ${appointmentData.customer.lastName}`,
            phone: appointmentData.customer.phone,
            email: appointmentData.customer.email,
            appointmentId: appointment.id,
            appointmentTime: `${appointmentData.date} ${appointmentData.time}`,
            location: appointmentData.locationName
        });
        
        return appointment.id;
    }
    
    // Store callback request
    function storeCallback(callbackData) {
        const callback = {
            id: generateId(),
            sessionId: getSessionId(),
            timestamp: new Date().toISOString(),
            data: callbackData,
            status: 'pending'
        };
        
        userData.callbacks.push(callback);
        saveData();
        
        // Also store as a lead for follow-up
        storeLead('callback', {
            name: `${callbackData.firstName} ${callbackData.lastName}`,
            phone: callbackData.phone,
            email: callbackData.email,
            callbackId: callback.id,
            bestTime: callbackData.bestTime,
            deviceInfo: callbackData.deviceInfo
        });
        
        return callback.id;
    }
    
    // Track call attempt
    function trackCall(source, phoneNumber) {
        trackInteraction('call', { source, phoneNumber });
        
        // If we have user data from the current session, associate it with the call
        const sessionId = getSessionId();
        const sessionLeads = userData.leads.filter(lead => lead.sessionId === sessionId);
        
        if (sessionLeads.length > 0) {
            // Update the most recent lead with call information
            const recentLead = sessionLeads[sessionLeads.length - 1];
            recentLead.callAttempts = recentLead.callAttempts || [];
            recentLead.callAttempts.push({
                timestamp: new Date().toISOString(),
                source: source
            });
            saveData();
        } else {
            // Create a new lead with minimal information
            storeLead('call', {
                phone: phoneNumber || 'unknown',
                callSource: source
            });
        }
    }
    
    // Get all leads for admin interface
    function getLeads() {
        return userData.leads;
    }
    
    // Get all appointments for admin interface
    function getAppointments() {
        return userData.appointments;
    }
    
    // Get all callbacks for admin interface
    function getCallbacks() {
        return userData.callbacks;
    }
    
    // Update lead status
    function updateLeadStatus(leadId, status) {
        const lead = userData.leads.find(l => l.id === leadId);
        if (lead) {
            lead.status = status;
            saveData();
            return true;
        }
        return false;
    }
    
    // Update appointment status
    function updateAppointmentStatus(appointmentId, status) {
        const appointment = userData.appointments.find(a => a.id === appointmentId);
        if (appointment) {
            appointment.status = status;
            saveData();
            return true;
        }
        return false;
    }
    
    // Update callback status
    function updateCallbackStatus(callbackId, status) {
        const callback = userData.callbacks.find(c => c.id === callbackId);
        if (callback) {
            callback.status = status;
            saveData();
            return true;
        }
        return false;
    }
    
    // Export data for admin interface
    function exportData() {
        return userData;
    }
    
    // Initialize the system
    function init() {
        loadData();
        trackVisit();
        
        // Listen for beforeunload to track time on page
        window.addEventListener('beforeunload', function() {
            trackInteraction('page_exit', {
                timeOnPage: (new Date() - new Date(userData.visits[userData.visits.length - 1].timestamp)) / 1000
            });
        });
    }
    
    // Public API
    return {
        init: init,
        trackInteraction: trackInteraction,
        trackCall: trackCall,
        storeLead: storeLead,
        storeAppointment: storeAppointment,
        storeCallback: storeCallback,
        getLeads: getLeads,
        getAppointments: getAppointments,
        getCallbacks: getCallbacks,
        updateLeadStatus: updateLeadStatus,
        updateAppointmentStatus: updateAppointmentStatus,
        updateCallbackStatus: updateCallbackStatus,
        exportData: exportData
    };
})();

// Initialize the user data collection system when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    UserDataCollection.init();
    
    // Integrate with appointment scheduling system
    if (typeof appointmentData !== 'undefined') {
        // Override the appointment submission function to store user data
        const originalSubmitFunction = customerNextBtn?.addEventListener;
        if (originalSubmitFunction) {
            customerNextBtn.addEventListener = function(event, callback) {
                if (event === 'click') {
                    const wrappedCallback = function() {
                        // Call original callback
                        const result = callback.apply(this, arguments);
                        
                        // Store appointment data
                        const appointmentId = UserDataCollection.storeAppointment(appointmentData);
                        
                        // Track interaction
                        UserDataCollection.trackInteraction('appointment_scheduled', {
                            appointmentId: appointmentId,
                            location: appointmentData.locationName,
                            date: appointmentData.date,
                            time: appointmentData.time,
                            devices: appointmentData.devices.length
                        });
                        
                        return result;
                    };
                    
                    return originalSubmitFunction.call(this, event, wrappedCallback);
                }
                
                return originalSubmitFunction.apply(this, arguments);
            };
        }
    }
    
    // Integrate with callback request form
    const callbackForm = document.getElementById('callback-form');
    if (callbackForm) {
        const originalSubmit = callbackForm.onsubmit;
        callbackForm.onsubmit = function(e) {
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
            
            // Store callback data
            const callbackId = UserDataCollection.storeCallback(formData);
            
            // Track interaction
            UserDataCollection.trackInteraction('callback_requested', {
                callbackId: callbackId,
                name: `${formData.firstName} ${formData.lastName}`,
                bestTime: formData.bestTime
            });
            
            // Call original submit handler if it exists
            if (originalSubmit) {
                return originalSubmit.call(this, e);
            }
            
            // Show confirmation (simplified version of the function in click-to-call.js)
            showCallbackConfirmation(formData);
        };
    }
    
    // Integrate with click-to-call buttons
    document.querySelectorAll('.call-button, .call-button-circle, .questions-widget-call-btn, [href^="tel:"]').forEach(button => {
        button.addEventListener('click', function(e) {
            // Extract phone number if available
            let phoneNumber = this.href ? this.href.replace('tel:', '') : '8005552274';
            
            // Determine source
            let source = 'unknown';
            if (this.classList.contains('call-button-circle')) {
                source = 'floating_button';
            } else if (this.classList.contains('questions-widget-call-btn')) {
                source = 'questions_widget';
            } else if (this.classList.contains('call-button')) {
                source = 'inline_button';
            } else if (this.href && this.href.startsWith('tel:')) {
                source = 'phone_link';
            }
            
            // Track call
            UserDataCollection.trackCall(source, phoneNumber);
        });
    });
    
    // Track form field interactions
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('change', function() {
            UserDataCollection.trackInteraction('form_field_change', {
                fieldId: this.id,
                fieldType: this.type || this.tagName.toLowerCase()
            });
        });
    });
    
    // Track button clicks
    document.querySelectorAll('button, .btn').forEach(button => {
        button.addEventListener('click', function() {
            // Skip if it's a call button (already tracked)
            if (this.classList.contains('call-button') || 
                this.classList.contains('call-button-circle') || 
                this.classList.contains('questions-widget-call-btn')) {
                return;
            }
            
            UserDataCollection.trackInteraction('button_click', {
                buttonId: this.id,
                buttonText: this.textContent.trim(),
                buttonClass: this.className
            });
        });
    });
});
