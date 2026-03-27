# Amazon Associates Site

## Current State
New project with empty Motoko backend and no frontend UI.

## Requested Changes (Diff)

### Add
- Amazon Associates affiliate marketing website
- Header with logo, navigation, search bar
- Hero banner section with CTA button
- Featured categories section (Electronics, Home & Kitchen, Outdoor & Sports, Fashion)
- Product cards grid with title, image, rating, price, and "View on Amazon" affiliate link button
- Sidebar with popular posts, newsletter signup widget, disclosure text
- "Recommended This Week" horizontal carousel
- Footer with links, social icons, affiliate disclosure
- Admin panel to manage products (add/edit/delete) with affiliate links
- Backend to store products, categories, and site settings

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Store products (id, title, description, imageUrl, price, originalPrice, rating, reviewCount, amazonUrl, category, featured, recommended)
2. Backend: Store categories with icons
3. Backend: Store site settings (site name, hero title, hero subtitle)
4. Frontend: Build full site matching the design preview
5. Frontend: Admin page (password protected) to manage products and settings
