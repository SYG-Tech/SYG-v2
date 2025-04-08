#!/bin/bash

# Create the standard navigation menu for main pages
MAIN_NAV='                <ul class="nav-menu">
                    <li class="nav-item"><a href="index" class="nav-link">Home</a></li>
                    <li class="nav-item"><a href="how-it-works" class="nav-link">How It Works</a></li>
                    <li class="nav-item"><a href="accepted-items" class="nav-link">What We Buy</a></li>
                    <li class="nav-item"><a href="pricing" class="nav-link">Pricing</a></li>
                    <li class="nav-item"><a href="locations" class="nav-link">Locations</a></li>
                    <li class="nav-item"><a href="mail-in" class="nav-link">Mail-In</a></li>
                    <li class="nav-item"><a href="about" class="nav-link">About/FAQ</a></li>
                </ul>'

# Create the standard navigation menu for item pages (with ../ prefix)
ITEM_NAV='                <ul class="nav-menu">
                    <li class="nav-item"><a href="../index" class="nav-link">Home</a></li>
                    <li class="nav-item"><a href="../how-it-works" class="nav-link">How It Works</a></li>
                    <li class="nav-item"><a href="../accepted-items" class="nav-link">What We Buy</a></li>
                    <li class="nav-item"><a href="../pricing" class="nav-link">Pricing</a></li>
                    <li class="nav-item"><a href="../locations" class="nav-link">Locations</a></li>
                    <li class="nav-item"><a href="../mail-in" class="nav-link">Mail-In</a></li>
                    <li class="nav-item"><a href="../about" class="nav-link">About/FAQ</a></li>
                </ul>'

# Fix main pages
for file in $(find /home/ubuntu/electronics-buyback-website -maxdepth 1 -name "*.html"); do
  # Replace the navigation menu
  sed -i '/<ul class="nav-menu">/,/<\/ul>/c\'"$MAIN_NAV" "$file"
  # Ensure consistent logo
  sed -i 's/<a href="index" class="logo">.*<\/a>/<a href="index" class="logo">SellYour<span>Gadgets<\/span>.com<\/a>/g' "$file"
done

# Fix item pages
for file in $(find /home/ubuntu/electronics-buyback-website/items -name "*.html"); do
  # Replace the navigation menu
  sed -i '/<ul class="nav-menu">/,/<\/ul>/c\'"$ITEM_NAV" "$file"
  # Ensure consistent logo
  sed -i 's/<a href="..\/index" class="logo">.*<\/a>/<a href="..\/index" class="logo">SellYour<span>Gadgets<\/span>.com<\/a>/g' "$file"
done

# Fix admin pages
for file in $(find /home/ubuntu/electronics-buyback-website/admin -name "*.html"); do
  # Ensure consistent logo
  sed -i 's/<a href=".*" class="logo">.*<\/a>/<a href="..\/index" class="logo">SellYour<span>Gadgets<\/span>.com<\/a>/g' "$file"
done

# Fix other subdirectory pages
for file in $(find /home/ubuntu/electronics-buyback-website -path "/home/ubuntu/electronics-buyback-website/items" -prune -o -path "/home/ubuntu/electronics-buyback-website/admin" -prune -o -type f -name "*.html" -not -path "/home/ubuntu/electronics-buyback-website/*.html" -print); do
  # Replace the navigation menu
  sed -i '/<ul class="nav-menu">/,/<\/ul>/c\'"$MAIN_NAV" "$file"
  # Ensure consistent logo
  sed -i 's/<a href=".*" class="logo">.*<\/a>/<a href="index" class="logo">SellYour<span>Gadgets<\/span>.com<\/a>/g' "$file"
done

echo "Navigation standardization complete!"
