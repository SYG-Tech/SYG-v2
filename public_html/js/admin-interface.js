/**
 * Admin Interface Integration with Data Storage
 * 
 * This file integrates the admin interface with the data storage system,
 * providing functionality for managing devices, locations, and other data.
 * Modified to ensure compatibility across different hosting environments
 * and to work properly with empty initial data.
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin interface initializing...');
    
    try {
        // Initialize tabs
        initTabs();
        
        // Load data for each tab
        loadDashboardData();
        loadDevicesData();
        loadLocationsData();
        loadPricingData();
        loadOrdersData();
        loadUsersData();
        loadSettingsData();
        
        // Initialize form handlers
        initFormHandlers();
        
        // Show empty state messages
        showEmptyStateMessages();
        
        // Directly attach event listeners to add buttons
        attachAddButtonListeners();
        
        console.log('Admin interface initialized successfully');
    } catch (error) {
        console.error('Error initializing admin interface:', error);
        // Display error message to user
        const adminContent = document.querySelector('.admin-content');
        if (adminContent) {
            adminContent.innerHTML = `
                <div class="admin-card" style="background-color: #f8d7da; color: #721c24; padding: 20px; margin-top: 20px;">
                    <h3>Error Loading Admin Interface</h3>
                    <p>There was a problem loading the admin interface. Please try the following:</p>
                    <ul>
                        <li>Refresh the page</li>
                        <li>Clear your browser cache</li>
                        <li>Contact support if the problem persists</li>
                    </ul>
                    <p>Technical details: ${error.message}</p>
                </div>
            `;
        }
    }
});

// Directly attach event listeners to add buttons
function attachAddButtonListeners() {
    console.log('Attaching add button listeners...');
    
    // Add Device button
    const addDeviceBtn = document.getElementById('add-device-btn');
    if (addDeviceBtn) {
        console.log('Add Device button found, attaching listener');
        addDeviceBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Add Device button clicked');
            showAddDeviceForm();
        };
    } else {
        console.warn('Add Device button not found');
    }
    
    // Add Location button
    const addLocationBtn = document.getElementById('add-location-btn');
    if (addLocationBtn) {
        console.log('Add Location button found, attaching listener');
        addLocationBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Add Location button clicked');
            showAddLocationForm();
        };
    } else {
        console.warn('Add Location button not found');
    }
    
    // Add User button
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        console.log('Add User button found, attaching listener');
        addUserBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Add User button clicked');
            showAddUserForm();
        };
    } else {
        console.warn('Add User button not found');
    }
}

// Show empty state messages for tables
function showEmptyStateMessages() {
    const tables = document.querySelectorAll('table.admin-table');
    tables.forEach(table => {
        const tbody = table.querySelector('tbody');
        if (tbody && tbody.children.length === 0) {
            const tableId = table.id;
            let message = 'No data available. Click the Add button to create new entries.';
            
            // Create empty state row
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.setAttribute('colspan', '100%');
            emptyCell.style.textAlign = 'center';
            emptyCell.style.padding = '30px';
            emptyCell.style.color = '#666';
            
            // Customize message based on table
            if (tableId === 'devices-table') {
                message = 'No devices available. Click "Add Device" to create new device entries.';
            } else if (tableId === 'locations-table') {
                message = 'No locations available. Click "Add Location" to create new location entries.';
            } else if (tableId === 'orders-table') {
                message = 'No orders available. Orders will appear here when created.';
            } else if (tableId === 'users-table') {
                message = 'No additional users available. Click "Add User" to create new user accounts.';
            } else if (tableId === 'recent-orders-table') {
                message = 'No recent orders available. Recent orders will appear here when created.';
            }
            
            emptyCell.textContent = message;
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
        }
    });
}

// Initialize tab functionality
function initTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    
    if (!tabLinks || tabLinks.length === 0) {
        console.warn('No tab links found');
        return;
    }
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the tab ID
            const tabId = this.getAttribute('data-tab');
            if (!tabId) {
                console.warn('Tab link missing data-tab attribute');
                return;
            }
            
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all tab links
            document.querySelectorAll('.tab-link').forEach(link => {
                link.parentElement.classList.remove('active');
            });
            
            // Show the selected tab content
            const selectedTab = document.getElementById(tabId);
            if (selectedTab) {
                selectedTab.classList.add('active');
            } else {
                console.warn(`Tab content with ID "${tabId}" not found`);
            }
            
            // Add active class to the clicked tab link
            this.parentElement.classList.add('active');
        });
    });
    
    // Ensure at least one tab is active
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) {
        const firstTab = document.querySelector('.tab-content');
        const firstTabLink = document.querySelector('.tab-link');
        
        if (firstTab) firstTab.classList.add('active');
        if (firstTabLink) firstTabLink.parentElement.classList.add('active');
    }
}

// Load dashboard data
function loadDashboardData() {
    try {
        // Get data from storage
        const devices = AdminDataStorage.getData('devices') || [];
        const locations = AdminDataStorage.getData('locations') || [];
        const orders = AdminDataStorage.getData('orders') || [];
        const leads = AdminDataStorage.getData('leads') || [];
        
        // Update dashboard stats
        const totalDevicesElement = document.getElementById('total-devices');
        if (totalDevicesElement) {
            totalDevicesElement.textContent = devices.length;
        }
        
        const totalLocationsElement = document.getElementById('total-locations');
        if (totalLocationsElement) {
            totalLocationsElement.textContent = locations.length;
        }
        
        // Calculate revenue
        const totalRevenue = orders.reduce((sum, order) => sum + (order.offeredPrice || 0), 0);
        const totalRevenueElement = document.getElementById('total-revenue');
        if (totalRevenueElement) {
            totalRevenueElement.textContent = `$${totalRevenue.toLocaleString()}`;
        }
        
        // Count completed orders
        const completedOrders = orders.filter(order => order.status === 'Completed').length;
        const completedOrdersElement = document.getElementById('completed-orders');
        if (completedOrdersElement) {
            completedOrdersElement.textContent = completedOrders;
        }
        
        // Recent orders table
        const recentOrdersTable = document.getElementById('recent-orders-table');
        if (recentOrdersTable) {
            const recentOrdersBody = recentOrdersTable.querySelector('tbody');
            if (recentOrdersBody) {
                recentOrdersBody.innerHTML = '';
                
                if (orders.length > 0) {
                    // Get 5 most recent orders
                    const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
                    
                    recentOrders.forEach(order => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${order.id}</td>
                            <td>${order.customerName}</td>
                            <td>${order.deviceName}</td>
                            <td>$${order.offeredPrice}</td>
                            <td><span class="status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span></td>
                            <td>${order.date}</td>
                        `;
                        recentOrdersBody.appendChild(row);
                    });
                }
            }
        }
        
        // Count new leads
        const newLeads = leads.filter(lead => lead.status === 'New').length;
        const newLeadsElement = document.getElementById('new-leads');
        if (newLeadsElement) {
            newLeadsElement.textContent = newLeads;
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load devices data
function loadDevicesData() {
    try {
        const devices = AdminDataStorage.getData('devices') || [];
        
        const devicesTable = document.getElementById('devices-table');
        if (devicesTable) {
            const devicesBody = devicesTable.querySelector('tbody');
            if (devicesBody) {
                devicesBody.innerHTML = '';
                
                if (devices.length > 0) {
                    devices.forEach(device => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${device.id}</td>
                            <td>${device.category}</td>
                            <td>${device.brand}</td>
                            <td>${device.model}</td>
                            <td>${device.storage}</td>
                            <td>$${device.basePrice}</td>
                            <td>${device.dateAdded}</td>
                            <td class="admin-actions">
                                <a href="#" class="btn-view" data-id="${device.id}" data-action="view-device"><i class="fas fa-eye"></i></a>
                                <a href="#" class="btn-edit" data-id="${device.id}" data-action="edit-device"><i class="fas fa-edit"></i></a>
                                <a href="#" class="btn-delete" data-id="${device.id}" data-action="delete-device"><i class="fas fa-trash"></i></a>
                            </td>
                        `;
                        devicesBody.appendChild(row);
                    });
                }
                
                // Add event listeners for device actions
                devicesBody.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const target = e.target.closest('[data-action]');
                    if (!target) return;
                    
                    const action = target.getAttribute('data-action');
                    const deviceId = parseInt(target.getAttribute('data-id'));
                    
                    switch (action) {
                        case 'view-device':
                            viewDevice(deviceId);
                            break;
                        case 'edit-device':
                            editDevice(deviceId);
                            break;
                        case 'delete-device':
                            deleteDevice(deviceId);
                            break;
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error loading devices data:', error);
    }
}

// Load locations data
function loadLocationsData() {
    try {
        const locations = AdminDataStorage.getData('locations') || [];
        
        const locationsTable = document.getElementById('locations-table');
        if (locationsTable) {
            const locationsBody = locationsTable.querySelector('tbody');
            if (locationsBody) {
                locationsBody.innerHTML = '';
                
                if (locations.length > 0) {
                    locations.forEach(location => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${location.id}</td>
                            <td>${location.name}</td>
                            <td>${location.address}</td>
                            <td>${location.phone}</td>
                            <td>${location.hours}</td>
                            <td>${location.manager}</td>
                            <td class="admin-actions">
                                <a href="#" class="btn-view" data-id="${location.id}" data-action="view-location"><i class="fas fa-eye"></i></a>
                                <a href="#" class="btn-edit" data-id="${location.id}" data-action="edit-location"><i class="fas fa-edit"></i></a>
                                <a href="#" class="btn-delete" data-id="${location.id}" data-action="delete-location"><i class="fas fa-trash"></i></a>
                            </td>
                        `;
                        locationsBody.appendChild(row);
                    });
                }
                
                // Add event listeners for location actions
                locationsBody.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const target = e.target.closest('[data-action]');
                    if (!target) return;
                    
                    const action = target.getAttribute('data-action');
                    const locationId = parseInt(target.getAttribute('data-id'));
                    
                    switch (action) {
                        case 'view-location':
                            viewLocation(locationId);
                            break;
                        case 'edit-location':
                            editLocation(locationId);
                            break;
                        case 'delete-location':
                            deleteLocation(locationId);
                            break;
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error loading locations data:', error);
    }
}

// Load pricing data
function loadPricingData() {
    try {
        const pricing = AdminDataStorage.getData('pricing') || {
            conditionMultipliers: {},
            categoryBonuses: {},
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        // Update condition multipliers
        const conditionMultipliersTable = document.getElementById('condition-multipliers-table');
        if (conditionMultipliersTable) {
            const conditionMultipliersBody = conditionMultipliersTable.querySelector('tbody');
            if (conditionMultipliersBody) {
                conditionMultipliersBody.innerHTML = '';
                
                for (const condition in pricing.conditionMultipliers) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${condition}</td>
                        <td>${pricing.conditionMultipliers[condition]}</td>
                        <td class="admin-actions">
                            <a href="#" class="btn-edit" data-condition="${condition}" data-action="edit-condition-multiplier"><i class="fas fa-edit"></i></a>
                        </td>
                    `;
                    conditionMultipliersBody.appendChild(row);
                }
            }
        }
        
        // Update category bonuses
        const categoryBonusesTable = document.getElementById('category-bonuses-table');
        if (categoryBonusesTable) {
            const categoryBonusesBody = categoryBonusesTable.querySelector('tbody');
            if (categoryBonusesBody) {
                categoryBonusesBody.innerHTML = '';
                
                for (const category in pricing.categoryBonuses) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${category}</td>
                        <td>${pricing.categoryBonuses[category]}</td>
                        <td class="admin-actions">
                            <a href="#" class="btn-edit" data-category="${category}" data-action="edit-category-bonus"><i class="fas fa-edit"></i></a>
                        </td>
                    `;
                    categoryBonusesBody.appendChild(row);
                }
            }
        }
        
        // Update last updated date
        const pricingLastUpdated = document.getElementById('pricing-last-updated');
        if (pricingLastUpdated) {
            pricingLastUpdated.textContent = pricing.lastUpdated || 'Never';
        }
    } catch (error) {
        console.error('Error loading pricing data:', error);
    }
}

// Load orders data
function loadOrdersData() {
    try {
        const orders = AdminDataStorage.getData('orders') || [];
        
        const ordersTable = document.getElementById('orders-table');
        if (ordersTable) {
            const ordersBody = ordersTable.querySelector('tbody');
            if (ordersBody) {
                ordersBody.innerHTML = '';
                
                if (orders.length > 0) {
                    orders.forEach(order => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${order.id}</td>
                            <td>${order.customerName}</td>
                            <td>${order.deviceName}</td>
                            <td>$${order.offeredPrice}</td>
                            <td><span class="status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span></td>
                            <td>${order.location}</td>
                            <td>${order.date}</td>
                            <td class="admin-actions">
                                <a href="#" class="btn-view" data-id="${order.id}" data-action="view-order"><i class="fas fa-eye"></i></a>
                                <a href="#" class="btn-edit" data-id="${order.id}" data-action="edit-order"><i class="fas fa-edit"></i></a>
                                <a href="#" class="btn-delete" data-id="${order.id}" data-action="delete-order"><i class="fas fa-trash"></i></a>
                            </td>
                        `;
                        ordersBody.appendChild(row);
                    });
                }
                
                // Add event listeners for order actions
                ordersBody.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const target = e.target.closest('[data-action]');
                    if (!target) return;
                    
                    const action = target.getAttribute('data-action');
                    const orderId = parseInt(target.getAttribute('data-id'));
                    
                    switch (action) {
                        case 'view-order':
                            viewOrder(orderId);
                            break;
                        case 'edit-order':
                            editOrder(orderId);
                            break;
                        case 'delete-order':
                            deleteOrder(orderId);
                            break;
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error loading orders data:', error);
    }
}

// Load users data
function loadUsersData() {
    try {
        const users = AdminDataStorage.getData('users') || [];
        
        const usersTable = document.getElementById('users-table');
        if (usersTable) {
            const usersBody = usersTable.querySelector('tbody');
            if (usersBody) {
                usersBody.innerHTML = '';
                
                if (users.length > 0) {
                    users.forEach(user => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>${user.lastLogin}</td>
                            <td class="admin-actions">
                                <a href="#" class="btn-view" data-id="${user.id}" data-action="view-user"><i class="fas fa-eye"></i></a>
                                <a href="#" class="btn-edit" data-id="${user.id}" data-action="edit-user"><i class="fas fa-edit"></i></a>
                                <a href="#" class="btn-delete" data-id="${user.id}" data-action="delete-user"><i class="fas fa-trash"></i></a>
                            </td>
                        `;
                        usersBody.appendChild(row);
                    });
                }
                
                // Add event listeners for user actions
                usersBody.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const target = e.target.closest('[data-action]');
                    if (!target) return;
                    
                    const action = target.getAttribute('data-action');
                    const userId = parseInt(target.getAttribute('data-id'));
                    
                    switch (action) {
                        case 'view-user':
                            viewUser(userId);
                            break;
                        case 'edit-user':
                            editUser(userId);
                            break;
                        case 'delete-user':
                            deleteUser(userId);
                            break;
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error loading users data:', error);
    }
}

// Load settings data
function loadSettingsData() {
    try {
        const settings = AdminDataStorage.getData('settings') || {
            companyName: 'SellYourGadgets.com',
            contactEmail: '',
            contactPhone: '',
            priceMatchPercentage: 0,
            loyaltyDiscountPercentage: 0,
            lastUpdated: 'Never'
        };
        
        // Update settings form
        const companyNameInput = document.getElementById('company-name');
        if (companyNameInput) companyNameInput.value = settings.companyName || '';
        
        const contactEmailInput = document.getElementById('contact-email');
        if (contactEmailInput) contactEmailInput.value = settings.contactEmail || '';
        
        const contactPhoneInput = document.getElementById('contact-phone');
        if (contactPhoneInput) contactPhoneInput.value = settings.contactPhone || '';
        
        const priceMatchInput = document.getElementById('price-match-percentage');
        if (priceMatchInput) priceMatchInput.value = settings.priceMatchPercentage || 0;
        
        const loyaltyDiscountInput = document.getElementById('loyalty-discount-percentage');
        if (loyaltyDiscountInput) loyaltyDiscountInput.value = settings.loyaltyDiscountPercentage || 0;
        
        // Update last updated date
        const settingsLastUpdated = document.getElementById('settings-last-updated');
        if (settingsLastUpdated) {
            settingsLastUpdated.textContent = settings.lastUpdated || 'Never';
        }
        
        // Initialize save settings button
        const saveSettingsBtn = document.getElementById('save-settings-btn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                saveSettings();
            });
        }
    } catch (error) {
        console.error('Error loading settings data:', error);
    }
}

// Initialize form handlers
function initFormHandlers() {
    // Add form close buttons
    const formCloseBtns = document.querySelectorAll('.form-close');
    formCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const formContainer = this.closest('.form-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
        });
    });
    
    // Close forms when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('form-container')) {
            e.target.style.display = 'none';
        }
    });
    
    // Initialize export/import data buttons
    const exportDataBtn = document.getElementById('export-data-btn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function(e) {
            e.preventDefault();
            exportData();
        });
    }
    
    const importDataBtn = document.getElementById('import-data-btn');
    if (importDataBtn) {
        importDataBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showImportDataForm();
        });
    }
    
    const resetDataBtn = document.getElementById('reset-data-btn');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
                resetData();
            }
        });
    }
}

// Device actions
function viewDevice(id) {
    const device = AdminDataStorage.getItem('devices', id);
    if (!device) {
        alert('Device not found');
        return;
    }
    
    const viewDeviceForm = document.getElementById('view-device-form');
    if (!viewDeviceForm) return;
    
    // Populate form
    viewDeviceForm.querySelector('#view-device-id').textContent = device.id;
    viewDeviceForm.querySelector('#view-device-category').textContent = device.category;
    viewDeviceForm.querySelector('#view-device-brand').textContent = device.brand;
    viewDeviceForm.querySelector('#view-device-model').textContent = device.model;
    viewDeviceForm.querySelector('#view-device-storage').textContent = device.storage;
    viewDeviceForm.querySelector('#view-device-price').textContent = `$${device.basePrice}`;
    viewDeviceForm.querySelector('#view-device-date').textContent = device.dateAdded;
    
    // Show form
    document.getElementById('view-device-container').style.display = 'block';
}

function editDevice(id) {
    const device = AdminDataStorage.getItem('devices', id);
    if (!device) {
        alert('Device not found');
        return;
    }
    
    const editDeviceForm = document.getElementById('edit-device-form');
    if (!editDeviceForm) return;
    
    // Populate form
    editDeviceForm.querySelector('#edit-device-id').value = device.id;
    editDeviceForm.querySelector('#edit-device-category').value = device.category;
    editDeviceForm.querySelector('#edit-device-brand').value = device.brand;
    editDeviceForm.querySelector('#edit-device-model').value = device.model;
    editDeviceForm.querySelector('#edit-device-storage').value = device.storage;
    editDeviceForm.querySelector('#edit-device-price').value = device.basePrice;
    
    // Show form
    document.getElementById('edit-device-container').style.display = 'block';
    
    // Handle form submission
    editDeviceForm.onsubmit = function(e) {
        e.preventDefault();
        
        const updatedDevice = {
            id: parseInt(editDeviceForm.querySelector('#edit-device-id').value),
            category: editDeviceForm.querySelector('#edit-device-category').value,
            brand: editDeviceForm.querySelector('#edit-device-brand').value,
            model: editDeviceForm.querySelector('#edit-device-model').value,
            storage: editDeviceForm.querySelector('#edit-device-storage').value,
            basePrice: parseFloat(editDeviceForm.querySelector('#edit-device-price').value),
            image: device.image || `../images/${editDeviceForm.querySelector('#edit-device-category').value.toLowerCase()}.svg`,
            dateAdded: device.dateAdded || new Date().toISOString().split('T')[0],
            condition: device.condition || ['New', 'Used', 'Damaged']
        };
        
        if (AdminDataStorage.updateItem('devices', updatedDevice.id, updatedDevice)) {
            alert('Device updated successfully');
            document.getElementById('edit-device-container').style.display = 'none';
            loadDevicesData();
            loadDashboardData();
        } else {
            alert('Error updating device');
        }
    };
}

function deleteDevice(id) {
    if (confirm('Are you sure you want to delete this device?')) {
        if (AdminDataStorage.deleteItem('devices', id)) {
            alert('Device deleted successfully');
            loadDevicesData();
            loadDashboardData();
        } else {
            alert('Error deleting device');
        }
    }
}

function showAddDeviceForm() {
    console.log('showAddDeviceForm called');
    const addDeviceForm = document.getElementById('add-device-form');
    const addDeviceContainer = document.getElementById('device-form-container');
    
    if (!addDeviceForm) {
        console.error('Add device form not found');
        return;
    }
    
    if (!addDeviceContainer) {
        console.error('Add device container not found');
        return;
    }
    
    // Clear form
    addDeviceForm.reset();
    
    // Show form
    addDeviceContainer.style.display = 'block';
    
    // Handle form submission
    addDeviceForm.onsubmit = function(e) {
        e.preventDefault();
        
        const categoryValue = addDeviceForm.querySelector('#device-category').value;
        const newDevice = {
            category: categoryValue,
            brand: addDeviceForm.querySelector('#device-brand').value,
            model: addDeviceForm.querySelector('#device-model').value,
            storage: addDeviceForm.querySelector('#device-storage').value,
            basePrice: parseFloat(addDeviceForm.querySelector('#device-price').value),
            image: `../images/${categoryValue.toLowerCase()}.svg`,
            dateAdded: new Date().toISOString().split('T')[0],
            condition: ['New', 'Used', 'Damaged']
        };
        
        if (AdminDataStorage.addItem('devices', newDevice)) {
            alert('Device added successfully');
            addDeviceContainer.style.display = 'none';
            loadDevicesData();
            loadDashboardData();
        } else {
            alert('Error adding device');
        }
    };
}

// Function to hide device form
function hideDeviceForm() {
    const deviceFormContainer = document.getElementById('device-form-container');
    if (deviceFormContainer) {
        deviceFormContainer.style.display = 'none';
    }
}

// Location actions
function viewLocation(id) {
    const location = AdminDataStorage.getItem('locations', id);
    if (!location) {
        alert('Location not found');
        return;
    }
    
    const viewLocationForm = document.getElementById('view-location-form');
    if (!viewLocationForm) return;
    
    // Populate form
    viewLocationForm.querySelector('#view-location-id').textContent = location.id;
    viewLocationForm.querySelector('#view-location-name').textContent = location.name;
    viewLocationForm.querySelector('#view-location-address').textContent = location.address;
    viewLocationForm.querySelector('#view-location-phone').textContent = location.phone;
    viewLocationForm.querySelector('#view-location-hours').textContent = location.hours;
    viewLocationForm.querySelector('#view-location-manager').textContent = location.manager;
    viewLocationForm.querySelector('#view-location-date').textContent = location.dateAdded;
    
    // Show form
    document.getElementById('view-location-container').style.display = 'block';
}

function editLocation(id) {
    const location = AdminDataStorage.getItem('locations', id);
    if (!location) {
        alert('Location not found');
        return;
    }
    
    const editLocationForm = document.getElementById('edit-location-form');
    if (!editLocationForm) return;
    
    // Populate form
    editLocationForm.querySelector('#edit-location-id').value = location.id;
    editLocationForm.querySelector('#edit-location-name').value = location.name;
    editLocationForm.querySelector('#edit-location-address').value = location.address;
    editLocationForm.querySelector('#edit-location-phone').value = location.phone;
    editLocationForm.querySelector('#edit-location-hours').value = location.hours;
    editLocationForm.querySelector('#edit-location-manager').value = location.manager;
    
    // Show form
    document.getElementById('edit-location-container').style.display = 'block';
    
    // Handle form submission
    editLocationForm.onsubmit = function(e) {
        e.preventDefault();
        
        const updatedLocation = {
            id: parseInt(editLocationForm.querySelector('#edit-location-id').value),
            name: editLocationForm.querySelector('#edit-location-name').value,
            address: editLocationForm.querySelector('#edit-location-address').value,
            phone: editLocationForm.querySelector('#edit-location-phone').value,
            hours: editLocationForm.querySelector('#edit-location-hours').value,
            manager: editLocationForm.querySelector('#edit-location-manager').value,
            dateAdded: location.dateAdded || new Date().toISOString().split('T')[0]
        };
        
        if (AdminDataStorage.updateItem('locations', updatedLocation.id, updatedLocation)) {
            alert('Location updated successfully');
            document.getElementById('edit-location-container').style.display = 'none';
            loadLocationsData();
            loadDashboardData();
        } else {
            alert('Error updating location');
        }
    };
}

function deleteLocation(id) {
    if (confirm('Are you sure you want to delete this location?')) {
        if (AdminDataStorage.deleteItem('locations', id)) {
            alert('Location deleted successfully');
            loadLocationsData();
            loadDashboardData();
        } else {
            alert('Error deleting location');
        }
    }
}

function showAddLocationForm() {
    console.log('showAddLocationForm called');
    const addLocationForm = document.getElementById('add-location-form');
    const addLocationContainer = document.getElementById('location-form-container');
    
    if (!addLocationForm) {
        console.error('Add location form not found');
        return;
    }
    
    if (!addLocationContainer) {
        console.error('Add location container not found');
        return;
    }
    
    // Clear form
    addLocationForm.reset();
    
    // Show form
    addLocationContainer.style.display = 'block';
    
    // Handle form submission
    addLocationForm.onsubmit = function(e) {
        e.preventDefault();
        
        const newLocation = {
            name: addLocationForm.querySelector('#location-name').value,
            address: addLocationForm.querySelector('#location-address').value,
            phone: addLocationForm.querySelector('#location-phone').value,
            hours: addLocationForm.querySelector('#location-hours').value,
            manager: addLocationForm.querySelector('#location-manager').value,
            dateAdded: new Date().toISOString().split('T')[0]
        };
        
        if (AdminDataStorage.addItem('locations', newLocation)) {
            alert('Location added successfully');
            addLocationContainer.style.display = 'none';
            loadLocationsData();
            loadDashboardData();
        } else {
            alert('Error adding location');
        }
    };
}

// Function to hide location form
function hideLocationForm() {
    const locationFormContainer = document.getElementById('location-form-container');
    if (locationFormContainer) {
        locationFormContainer.style.display = 'none';
    }
}

// Order actions
function viewOrder(id) {
    const order = AdminDataStorage.getItem('orders', id);
    if (!order) {
        alert('Order not found');
        return;
    }
    
    const viewOrderForm = document.getElementById('view-order-form');
    if (!viewOrderForm) return;
    
    // Populate form
    viewOrderForm.querySelector('#view-order-id').textContent = order.id;
    viewOrderForm.querySelector('#view-order-customer').textContent = order.customerName;
    viewOrderForm.querySelector('#view-order-email').textContent = order.customerEmail;
    viewOrderForm.querySelector('#view-order-phone').textContent = order.customerPhone;
    viewOrderForm.querySelector('#view-order-device').textContent = order.deviceName;
    viewOrderForm.querySelector('#view-order-condition').textContent = order.condition;
    viewOrderForm.querySelector('#view-order-price').textContent = `$${order.offeredPrice}`;
    viewOrderForm.querySelector('#view-order-status').textContent = order.status;
    viewOrderForm.querySelector('#view-order-payment').textContent = order.paymentMethod;
    viewOrderForm.querySelector('#view-order-location').textContent = order.location;
    viewOrderForm.querySelector('#view-order-date').textContent = order.date;
    
    // Show form
    document.getElementById('view-order-container').style.display = 'block';
}

function editOrder(id) {
    const order = AdminDataStorage.getItem('orders', id);
    if (!order) {
        alert('Order not found');
        return;
    }
    
    const editOrderForm = document.getElementById('edit-order-form');
    if (!editOrderForm) return;
    
    // Populate form
    editOrderForm.querySelector('#edit-order-id').value = order.id;
    editOrderForm.querySelector('#edit-order-customer').value = order.customerName;
    editOrderForm.querySelector('#edit-order-email').value = order.customerEmail;
    editOrderForm.querySelector('#edit-order-phone').value = order.customerPhone;
    editOrderForm.querySelector('#edit-order-device').value = order.deviceName;
    editOrderForm.querySelector('#edit-order-condition').value = order.condition;
    editOrderForm.querySelector('#edit-order-price').value = order.offeredPrice;
    editOrderForm.querySelector('#edit-order-status').value = order.status;
    editOrderForm.querySelector('#edit-order-payment').value = order.paymentMethod;
    editOrderForm.querySelector('#edit-order-location').value = order.location;
    
    // Show form
    document.getElementById('edit-order-container').style.display = 'block';
    
    // Handle form submission
    editOrderForm.onsubmit = function(e) {
        e.preventDefault();
        
        const updatedOrder = {
            id: parseInt(editOrderForm.querySelector('#edit-order-id').value),
            customerName: editOrderForm.querySelector('#edit-order-customer').value,
            customerEmail: editOrderForm.querySelector('#edit-order-email').value,
            customerPhone: editOrderForm.querySelector('#edit-order-phone').value,
            deviceName: editOrderForm.querySelector('#edit-order-device').value,
            condition: editOrderForm.querySelector('#edit-order-condition').value,
            offeredPrice: parseFloat(editOrderForm.querySelector('#edit-order-price').value),
            status: editOrderForm.querySelector('#edit-order-status').value,
            paymentMethod: editOrderForm.querySelector('#edit-order-payment').value,
            location: editOrderForm.querySelector('#edit-order-location').value,
            date: order.date || new Date().toISOString().split('T')[0],
            deviceId: order.deviceId || 0
        };
        
        if (AdminDataStorage.updateItem('orders', updatedOrder.id, updatedOrder)) {
            alert('Order updated successfully');
            document.getElementById('edit-order-container').style.display = 'none';
            loadOrdersData();
            loadDashboardData();
        } else {
            alert('Error updating order');
        }
    };
}

function deleteOrder(id) {
    if (confirm('Are you sure you want to delete this order?')) {
        if (AdminDataStorage.deleteItem('orders', id)) {
            alert('Order deleted successfully');
            loadOrdersData();
            loadDashboardData();
        } else {
            alert('Error deleting order');
        }
    }
}

// User actions
function viewUser(id) {
    const user = AdminDataStorage.getItem('users', id);
    if (!user) {
        alert('User not found');
        return;
    }
    
    const viewUserForm = document.getElementById('view-user-form');
    if (!viewUserForm) return;
    
    // Populate form
    viewUserForm.querySelector('#view-user-id').textContent = user.id;
    viewUserForm.querySelector('#view-user-name').textContent = user.name;
    viewUserForm.querySelector('#view-user-email').textContent = user.email;
    viewUserForm.querySelector('#view-user-role').textContent = user.role;
    viewUserForm.querySelector('#view-user-login').textContent = user.lastLogin;
    
    // Show form
    document.getElementById('view-user-container').style.display = 'block';
}

function editUser(id) {
    const user = AdminDataStorage.getItem('users', id);
    if (!user) {
        alert('User not found');
        return;
    }
    
    const editUserForm = document.getElementById('edit-user-form');
    if (!editUserForm) return;
    
    // Populate form
    editUserForm.querySelector('#edit-user-id').value = user.id;
    editUserForm.querySelector('#edit-user-name').value = user.name;
    editUserForm.querySelector('#edit-user-email').value = user.email;
    editUserForm.querySelector('#edit-user-role').value = user.role;
    
    // Show form
    document.getElementById('edit-user-container').style.display = 'block';
    
    // Handle form submission
    editUserForm.onsubmit = function(e) {
        e.preventDefault();
        
        const updatedUser = {
            id: parseInt(editUserForm.querySelector('#edit-user-id').value),
            name: editUserForm.querySelector('#edit-user-name').value,
            email: editUserForm.querySelector('#edit-user-email').value,
            role: editUserForm.querySelector('#edit-user-role').value,
            lastLogin: user.lastLogin || 'Never'
        };
        
        if (AdminDataStorage.updateItem('users', updatedUser.id, updatedUser)) {
            alert('User updated successfully');
            document.getElementById('edit-user-container').style.display = 'none';
            loadUsersData();
        } else {
            alert('Error updating user');
        }
    };
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        if (AdminDataStorage.deleteItem('users', id)) {
            alert('User deleted successfully');
            loadUsersData();
        } else {
            alert('Error deleting user');
        }
    }
}

function showAddUserForm() {
    console.log('showAddUserForm called');
    const addUserForm = document.getElementById('add-user-form');
    const addUserContainer = document.getElementById('user-form-container');
    
    if (!addUserForm) {
        console.error('Add user form not found');
        return;
    }
    
    if (!addUserContainer) {
        console.error('Add user container not found');
        return;
    }
    
    // Clear form
    addUserForm.reset();
    
    // Show form
    addUserContainer.style.display = 'block';
    
    // Handle form submission
    addUserForm.onsubmit = function(e) {
        e.preventDefault();
        
        const newUser = {
            name: addUserForm.querySelector('#user-name').value,
            email: addUserForm.querySelector('#user-email').value,
            role: addUserForm.querySelector('#user-role').value,
            lastLogin: 'Never'
        };
        
        if (AdminDataStorage.addItem('users', newUser)) {
            alert('User added successfully');
            addUserContainer.style.display = 'none';
            loadUsersData();
        } else {
            alert('Error adding user');
        }
    };
}

// Function to hide user form
function hideUserForm() {
    const userFormContainer = document.getElementById('user-form-container');
    if (userFormContainer) {
        userFormContainer.style.display = 'none';
    }
}

// Settings actions
function saveSettings() {
    const settingsForm = document.getElementById('settings-form');
    if (!settingsForm) return;
    
    const updatedSettings = {
        companyName: settingsForm.querySelector('#company-name').value,
        contactEmail: settingsForm.querySelector('#contact-email').value,
        contactPhone: settingsForm.querySelector('#contact-phone').value,
        priceMatchPercentage: parseFloat(settingsForm.querySelector('#price-match-percentage').value),
        loyaltyDiscountPercentage: parseFloat(settingsForm.querySelector('#loyalty-discount-percentage').value),
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    if (AdminDataStorage.saveData('settings', updatedSettings)) {
        alert('Settings saved successfully');
        loadSettingsData();
    } else {
        alert('Error saving settings');
    }
}

// Data export/import actions
function exportData() {
    const exportData = AdminDataStorage.exportData();
    
    // Create a download link
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sellyourgadgets_admin_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showImportDataForm() {
    const importDataForm = document.getElementById('import-data-form');
    if (!importDataForm) return;
    
    // Clear form
    importDataForm.reset();
    
    // Show form
    document.getElementById('import-data-container').style.display = 'block';
    
    // Handle form submission
    importDataForm.onsubmit = function(e) {
        e.preventDefault();
        
        const fileInput = importDataForm.querySelector('#import-data-file');
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Please select a file to import');
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const jsonData = e.target.result;
            
            if (AdminDataStorage.importData(jsonData)) {
                alert('Data imported successfully');
                document.getElementById('import-data-container').style.display = 'none';
                
                // Reload all data
                loadDashboardData();
                loadDevicesData();
                loadLocationsData();
                loadPricingData();
                loadOrdersData();
                loadUsersData();
                loadSettingsData();
                
                // Show empty state messages
                showEmptyStateMessages();
            } else {
                alert('Error importing data');
            }
        };
        
        reader.readAsText(file);
    };
}

function resetData() {
    if (AdminDataStorage.resetToDefaults()) {
        alert('Data reset to defaults successfully');
        
        // Reload all data
        loadDashboardData();
        loadDevicesData();
        loadLocationsData();
        loadPricingData();
        loadOrdersData();
        loadUsersData();
        loadSettingsData();
        
        // Show empty state messages
        showEmptyStateMessages();
    } else {
        alert('Error resetting data');
    }
}
