// Price comparison tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sample competitor data - this would be populated from a database in production
    const competitorData = {
        'iphone': {
            'iPhone 15 Pro Max': {
                'sellyourgadgets': {'128GB': 850, '256GB': 900, '512GB': 950, '1TB': 1000},
                'competitor1': {'128GB': 800, '256GB': 850, '512GB': 900, '1TB': 950},
                'competitor2': {'128GB': 780, '256GB': 830, '512GB': 880, '1TB': 930},
                'competitor3': {'128GB': 820, '256GB': 870, '512GB': 920, '1TB': 970}
            },
            'iPhone 15 Pro': {
                'sellyourgadgets': {'128GB': 750, '256GB': 800, '512GB': 850, '1TB': 900},
                'competitor1': {'128GB': 700, '256GB': 750, '512GB': 800, '1TB': 850},
                'competitor2': {'128GB': 680, '256GB': 730, '512GB': 780, '1TB': 830},
                'competitor3': {'128GB': 720, '256GB': 770, '512GB': 820, '1TB': 870}
            },
            'iPhone 15': {
                'sellyourgadgets': {'128GB': 650, '256GB': 700, '512GB': 750},
                'competitor1': {'128GB': 600, '256GB': 650, '512GB': 700},
                'competitor2': {'128GB': 580, '256GB': 630, '512GB': 680},
                'competitor3': {'128GB': 620, '256GB': 670, '512GB': 720}
            }
        },
        'samsung': {
            'Galaxy S24 Ultra': {
                'sellyourgadgets': {'256GB': 800, '512GB': 850, '1TB': 900},
                'competitor1': {'256GB': 750, '512GB': 800, '1TB': 850},
                'competitor2': {'256GB': 730, '512GB': 780, '1TB': 830},
                'competitor3': {'256GB': 770, '512GB': 820, '1TB': 870}
            },
            'Galaxy S24+': {
                'sellyourgadgets': {'256GB': 700, '512GB': 750},
                'competitor1': {'256GB': 650, '512GB': 700},
                'competitor2': {'256GB': 630, '512GB': 680},
                'competitor3': {'256GB': 670, '512GB': 720}
            },
            'Galaxy S24': {
                'sellyourgadgets': {'128GB': 600, '256GB': 650},
                'competitor1': {'128GB': 550, '256GB': 600},
                'competitor2': {'128GB': 530, '256GB': 580},
                'competitor3': {'128GB': 570, '256GB': 620}
            }
        },
        'macbook': {
            'MacBook Pro 16" (M3)': {
                'sellyourgadgets': {'512GB': 1500, '1TB': 1600, '2TB': 1700},
                'competitor1': {'512GB': 1450, '1TB': 1550, '2TB': 1650},
                'competitor2': {'512GB': 1400, '1TB': 1500, '2TB': 1600},
                'competitor3': {'512GB': 1475, '1TB': 1575, '2TB': 1675}
            },
            'MacBook Pro 14" (M3)': {
                'sellyourgadgets': {'512GB': 1300, '1TB': 1400, '2TB': 1500},
                'competitor1': {'512GB': 1250, '1TB': 1350, '2TB': 1450},
                'competitor2': {'512GB': 1200, '1TB': 1300, '2TB': 1400},
                'competitor3': {'512GB': 1275, '1TB': 1375, '2TB': 1475}
            },
            'MacBook Air (M2)': {
                'sellyourgadgets': {'256GB': 800, '512GB': 900, '1TB': 1000},
                'competitor1': {'256GB': 750, '512GB': 850, '1TB': 950},
                'competitor2': {'256GB': 730, '512GB': 830, '1TB': 930},
                'competitor3': {'256GB': 770, '512GB': 870, '1TB': 970}
            }
        },
        'ipad': {
            'iPad Pro 12.9" (M2)': {
                'sellyourgadgets': {'128GB': 700, '256GB': 750, '512GB': 800, '1TB': 850, '2TB': 900},
                'competitor1': {'128GB': 650, '256GB': 700, '512GB': 750, '1TB': 800, '2TB': 850},
                'competitor2': {'128GB': 630, '256GB': 680, '512GB': 730, '1TB': 780, '2TB': 830},
                'competitor3': {'128GB': 670, '256GB': 720, '512GB': 770, '1TB': 820, '2TB': 870}
            },
            'iPad Pro 11" (M2)': {
                'sellyourgadgets': {'128GB': 600, '256GB': 650, '512GB': 700, '1TB': 750, '2TB': 800},
                'competitor1': {'128GB': 550, '256GB': 600, '512GB': 650, '1TB': 700, '2TB': 750},
                'competitor2': {'128GB': 530, '256GB': 580, '512GB': 630, '1TB': 680, '2TB': 730},
                'competitor3': {'128GB': 570, '256GB': 620, '512GB': 670, '1TB': 720, '2TB': 770}
            },
            'iPad Air': {
                'sellyourgadgets': {'64GB': 400, '256GB': 450},
                'competitor1': {'64GB': 350, '256GB': 400},
                'competitor2': {'64GB': 330, '256GB': 380},
                'competitor3': {'64GB': 370, '256GB': 420}
            }
        },
        'gaming': {
            'PlayStation 5': {
                'sellyourgadgets': {'Digital': 250, 'Disc': 300},
                'competitor1': {'Digital': 230, 'Disc': 280},
                'competitor2': {'Digital': 220, 'Disc': 270},
                'competitor3': {'Digital': 240, 'Disc': 290}
            },
            'Xbox Series X': {
                'sellyourgadgets': {'1TB': 280},
                'competitor1': {'1TB': 260},
                'competitor2': {'1TB': 250},
                'competitor3': {'1TB': 270}
            },
            'Nintendo Switch': {
                'sellyourgadgets': {'Standard': 180, 'OLED': 220},
                'competitor1': {'Standard': 160, 'OLED': 200},
                'competitor2': {'Standard': 150, 'OLED': 190},
                'competitor3': {'Standard': 170, 'OLED': 210}
            }
        },
        'drones': {
            'DJI Mavic 3 Pro': {
                'sellyourgadgets': {'Standard': 1200, 'Cine': 1500},
                'competitor1': {'Standard': 1150, 'Cine': 1450},
                'competitor2': {'Standard': 1100, 'Cine': 1400},
                'competitor3': {'Standard': 1175, 'Cine': 1475}
            },
            'DJI Air 3': {
                'sellyourgadgets': {'Standard': 800, 'Fly More': 900},
                'competitor1': {'Standard': 750, 'Fly More': 850},
                'competitor2': {'Standard': 730, 'Fly More': 830},
                'competitor3': {'Standard': 770, 'Fly More': 870}
            },
            'DJI Mini 4 Pro': {
                'sellyourgadgets': {'Standard': 500, 'Fly More': 600},
                'competitor1': {'Standard': 450, 'Fly More': 550},
                'competitor2': {'Standard': 430, 'Fly More': 530},
                'competitor3': {'Standard': 470, 'Fly More': 570}
            }
        },
        'tools': {
            'DeWalt 20V MAX Drill': {
                'sellyourgadgets': {'Tool Only': 80, 'With Battery': 120},
                'competitor1': {'Tool Only': 70, 'With Battery': 110},
                'competitor2': {'Tool Only': 65, 'With Battery': 105},
                'competitor3': {'Tool Only': 75, 'With Battery': 115}
            },
            'Milwaukee M18 Impact Driver': {
                'sellyourgadgets': {'Tool Only': 90, 'With Battery': 130},
                'competitor1': {'Tool Only': 80, 'With Battery': 120},
                'competitor2': {'Tool Only': 75, 'With Battery': 115},
                'competitor3': {'Tool Only': 85, 'With Battery': 125}
            },
            'Makita 18V LXT Combo Kit': {
                'sellyourgadgets': {'2-Tool': 150, '4-Tool': 250},
                'competitor1': {'2-Tool': 140, '4-Tool': 240},
                'competitor2': {'2-Tool': 135, '4-Tool': 235},
                'competitor3': {'2-Tool': 145, '4-Tool': 245}
            }
        }
    };

    // Initialize the comparison tool
    function initComparisonTool() {
        const categorySelect = document.getElementById('comparison-category');
        const modelSelect = document.getElementById('comparison-model');
        const storageSelect = document.getElementById('comparison-storage');
        const compareButton = document.getElementById('compare-prices-btn');
        const resultsContainer = document.getElementById('comparison-results');
        
        // Populate categories
        for (const category in competitorData) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = getCategoryName(category);
            categorySelect.appendChild(option);
        }
        
        // Handle category change
        categorySelect.addEventListener('change', function() {
            // Clear model select
            modelSelect.innerHTML = '<option value="">Select Model</option>';
            storageSelect.innerHTML = '<option value="">Select Storage/Version</option>';
            resultsContainer.innerHTML = '';
            
            const category = this.value;
            if (category && competitorData[category]) {
                // Populate models for selected category
                for (const model in competitorData[category]) {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    modelSelect.appendChild(option);
                }
            }
        });
        
        // Handle model change
        modelSelect.addEventListener('change', function() {
            // Clear storage select
            storageSelect.innerHTML = '<option value="">Select Storage/Version</option>';
            resultsContainer.innerHTML = '';
            
            const category = categorySelect.value;
            const model = this.value;
            
            if (category && model && competitorData[category][model]) {
                const storageOptions = Object.keys(competitorData[category][model]['sellyourgadgets']);
                
                // Populate storage options
                for (const storage of storageOptions) {
                    const option = document.createElement('option');
                    option.value = storage;
                    option.textContent = storage;
                    storageSelect.appendChild(option);
                }
            }
        });
        
        // Handle compare button click
        compareButton.addEventListener('click', function() {
            const category = categorySelect.value;
            const model = modelSelect.value;
            const storage = storageSelect.value;
            
            if (!category || !model || !storage) {
                resultsContainer.innerHTML = '<div class="alert-box">Please select all options to compare prices.</div>';
                return;
            }
            
            if (competitorData[category] && competitorData[category][model]) {
                const modelData = competitorData[category][model];
                
                // Create comparison table
                let tableHTML = `
                    <h3>Price Comparison for ${model} (${storage})</h3>
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Price</th>
                                <th>Difference</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                const ourPrice = modelData['sellyourgadgets'][storage];
                
                // Add our price first
                tableHTML += `
                    <tr class="our-price">
                        <td><strong>SellYourGadgets.com</strong> <span class="best-price-badge">Best Price!</span></td>
                        <td>$${ourPrice}</td>
                        <td>—</td>
                    </tr>
                `;
                
                // Add competitor prices
                for (const competitor in modelData) {
                    if (competitor !== 'sellyourgadgets') {
                        const competitorPrice = modelData[competitor][storage];
                        const difference = ourPrice - competitorPrice;
                        const differenceText = difference > 0 ? `+$${difference}` : `-$${Math.abs(difference)}`;
                        const differenceClass = difference > 0 ? 'positive-difference' : 'negative-difference';
                        
                        tableHTML += `
                            <tr>
                                <td>${getCompetitorName(competitor)}</td>
                                <td>$${competitorPrice}</td>
                                <td class="${differenceClass}">${differenceText}</td>
                            </tr>
                        `;
                    }
                }
                
                tableHTML += `
                        </tbody>
                    </table>
                    <div class="price-match-note">
                        <i class="fas fa-medal"></i> Remember: We'll match any legitimate competitor's price and add an extra 5%!
                    </div>
                `;
                
                resultsContainer.innerHTML = tableHTML;
            }
        });
    }
    
    // Helper function to get formatted category name
    function getCategoryName(category) {
        const names = {
            'iphone': 'iPhone',
            'samsung': 'Samsung Galaxy',
            'macbook': 'MacBook',
            'ipad': 'iPad',
            'gaming': 'Gaming Consoles',
            'drones': 'Drones',
            'tools': 'Power Tools'
        };
        
        return names[category] || category;
    }
    
    // Helper function to get competitor name
    function getCompetitorName(competitor) {
        const names = {
            'competitor1': 'ItsWorthMore.com',
            'competitor2': 'Paymore.com',
            'competitor3': 'ecoATM'
        };
        
        return names[competitor] || competitor;
    }
    
    // Initialize the tool if the elements exist
    if (document.getElementById('comparison-category')) {
        initComparisonTool();
    }
});
