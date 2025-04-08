/**
 * Admin Data Storage System - Modified for cross-domain compatibility with empty initial data
 * 
 * This file provides a data storage system for the admin functionality
 * using a combination of cookies and in-memory storage to ensure compatibility
 * across different hosting environments.
 */

// Initialize data storage namespace
const AdminDataStorage = {
    // Storage keys
    keys: {
        devices: 'syg_admin_devices',
        locations: 'syg_admin_locations',
        pricing: 'syg_admin_pricing',
        orders: 'syg_admin_orders',
        users: 'syg_admin_users',
        settings: 'syg_admin_settings',
        appointments: 'syg_admin_appointments',
        leads: 'syg_admin_leads'
    },
    
    // In-memory data storage (fallback when localStorage is not available)
    memoryStorage: {},
    
    // Empty default data structures
    defaultData: {
        devices: [],
        locations: [],
        orders: [],
        users: [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'Administrator',
                lastLogin: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]
            }
        ],
        settings: {
            companyName: 'SellYourGadgets.com',
            contactEmail: '',
            contactPhone: '',
            priceMatchPercentage: 0,
            loyaltyDiscountPercentage: 0,
            lastUpdated: new Date().toISOString().split('T')[0]
        },
        appointments: [],
        leads: [],
        pricing: {
            conditionMultipliers: {
                'New': 1.0,
                'Like New': 0.9,
                'Excellent': 0.8,
                'Good': 0.7,
                'Fair': 0.5,
                'Poor': 0.3,
                'Damaged': 0.2
            },
            categoryBonuses: {
                'Smartphones': 1.0,
                'Laptops': 1.0,
                'Tablets': 1.0,
                'Gaming': 1.0,
                'Wearables': 1.0
            },
            lastUpdated: new Date().toISOString().split('T')[0]
        }
    },
    
    // Check if localStorage is available
    isLocalStorageAvailable: function() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    },
    
    // Initialize storage with empty data structures
    init: function() {
        // Check if localStorage is available
        const useLocalStorage = this.isLocalStorageAvailable();
        
        // Check each data type and initialize if needed
        for (const key in this.keys) {
            if (useLocalStorage) {
                // Using localStorage
                if (!localStorage.getItem(this.keys[key])) {
                    localStorage.setItem(this.keys[key], JSON.stringify(this.defaultData[key]));
                }
            } else {
                // Using memory storage
                if (!this.memoryStorage[this.keys[key]]) {
                    this.memoryStorage[this.keys[key]] = this.defaultData[key];
                }
            }
        }
    },
    
    // Get data from storage
    getData: function(key) {
        if (!this.keys[key]) return null;
        
        if (this.isLocalStorageAvailable()) {
            // Using localStorage
            const data = localStorage.getItem(this.keys[key]);
            return data ? JSON.parse(data) : null;
        } else {
            // Using memory storage
            return this.memoryStorage[this.keys[key]] || null;
        }
    },
    
    // Save data to storage
    saveData: function(key, data) {
        if (!this.keys[key]) return false;
        
        if (this.isLocalStorageAvailable()) {
            // Using localStorage
            localStorage.setItem(this.keys[key], JSON.stringify(data));
        } else {
            // Using memory storage
            this.memoryStorage[this.keys[key]] = data;
        }
        
        return true;
    },
    
    // Add a new item to a collection
    addItem: function(key, item) {
        if (!this.keys[key]) return false;
        
        const collection = this.getData(key) || [];
        
        // Generate a new ID
        const newId = collection.length > 0 ? Math.max(...collection.map(i => i.id)) + 1 : 1;
        item.id = newId;
        
        // Add the item to the collection
        collection.push(item);
        
        // Save the updated collection
        return this.saveData(key, collection);
    },
    
    // Update an existing item in a collection
    updateItem: function(key, id, updatedItem) {
        if (!this.keys[key]) return false;
        
        const collection = this.getData(key) || [];
        
        // Find the item index
        const index = collection.findIndex(item => item.id === id);
        if (index === -1) return false;
        
        // Update the item
        updatedItem.id = id; // Ensure ID remains the same
        collection[index] = updatedItem;
        
        // Save the updated collection
        return this.saveData(key, collection);
    },
    
    // Delete an item from a collection
    deleteItem: function(key, id) {
        if (!this.keys[key]) return false;
        
        const collection = this.getData(key) || [];
        
        // Filter out the item to delete
        const updatedCollection = collection.filter(item => item.id !== id);
        
        // Save the updated collection
        return this.saveData(key, updatedCollection);
    },
    
    // Get a single item from a collection
    getItem: function(key, id) {
        if (!this.keys[key]) return null;
        
        const collection = this.getData(key) || [];
        
        // Find the item
        return collection.find(item => item.id === id) || null;
    },
    
    // Export data to JSON
    exportData: function() {
        const exportData = {};
        
        for (const key in this.keys) {
            exportData[key] = this.getData(key);
        }
        
        return JSON.stringify(exportData, null, 2);
    },
    
    // Import data from JSON
    importData: function(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            
            for (const key in this.keys) {
                if (importedData[key]) {
                    this.saveData(key, importedData[key]);
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },
    
    // Reset all data to empty structures
    resetToDefaults: function() {
        for (const key in this.keys) {
            this.saveData(key, this.defaultData[key]);
        }
        
        return true;
    }
};

// Initialize the storage system when the script loads
AdminDataStorage.init();
