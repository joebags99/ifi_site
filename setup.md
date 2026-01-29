# Setup Guide for Claude Code

This guide will help you continue development of the Icing for Izaac website using Claude Code.

## Initial Setup Checklist

### 1. Repository Setup
```bash
cd icing-for-izaac-website
git init
git add .
git commit -m "Initial commit: Icing for Izaac website foundation"
```

### 2. Add Your Images
Replace placeholder references with actual images in the `/images` directory:
- `logo.png` - Main logo (white/transparent background)
- `favicon.png` - Browser favicon
- `hero-pattern.png` - Optional subtle background pattern
- `cheesecake.jpg` - Featured cheesecake image
- `cookies.jpg` - Featured cookies image
- `cupcakes.jpg` - Featured cupcakes image
- `family-photo.jpg` - Grayce and family photo

### 3. Configure Printify Integration
Edit `js/printify.js`:
```javascript
const PRINTIFY_CONFIG = {
    apiToken: 'YOUR_ACTUAL_API_TOKEN',
    shopId: 'YOUR_ACTUAL_SHOP_ID',
    apiBaseUrl: 'https://api.printify.com/v1'
};
```

**To get your Printify credentials:**
1. Sign up at https://printify.com
2. Connect your store or create products
3. Go to Account Settings → API
4. Generate an API token
5. Find your shop ID in the dashboard URL

### 4. Configure DoorDash Link
Edit `js/main.js` and update the DoorDash URL:
```javascript
const doordashUrl = 'YOUR_ACTUAL_DOORDASH_STORE_LINK';
```

### 5. Test Locally
```bash
# Option 1: Python server (recommended)
python3 -m http.server 8000

# Option 2: Node.js (if you have it)
npx serve

# Then open: http://localhost:8000
```

## What's Already Built

### ✅ Core Structure
- Responsive navigation with mobile menu
- Hero section with call-to-action
- Product showcase grid
- Services section
- About section
- Footer with social links

### ✅ Styling
- Pink, gold, and white color palette
- Elegant typography (Playfair Display + Montserrat)
- Smooth animations and transitions
- Mobile-responsive design
- Card-based layouts

### ✅ JavaScript Features
- Mobile menu toggle
- Scroll effects on navbar
- Intersection Observer animations
- Cart system (localStorage)
- Notification system
- Printify API integration setup

### ✅ Pages Ready for Content
- `index.html` - Homepage (complete)
- `apparel.html` - Apparel shop (complete, needs Printify config)
- Need to create:
  - `about.html` - Full story page
  - `menu.html` - Products and menu
  - `contact.html` - Contact form and location
  - `careers.html` - Join the team page

## Next Steps for Claude Code

### Priority 1: Complete Core Pages
1. **menu.html** - Product listings with categories (cheesecakes, cookies, cupcakes)
2. **about.html** - Expanded story of Grayce and Izaac
3. **contact.html** - Contact form, hours, location map
4. **careers.html** - Job opportunities and application

### Priority 2: Enhanced Features
1. **Shopping Cart Page** - Full cart with checkout process
2. **Product Gallery** - Filterable gallery of products
3. **Testimonials Section** - Customer reviews
4. **Blog Section** - Updates and stories
5. **Newsletter Integration** - Connect to email service (Mailchimp/ConvertKit)

### Priority 3: Advanced Features
1. **Online Ordering System** - Custom order forms
2. **Event Booking** - Catering request system
3. **Recipe Blog** - Share baking tips
4. **Loyalty Program** - Customer rewards
5. **Admin Dashboard** - Manage products and orders

## Project Structure

```
icing-for-izaac-website/
├── index.html              # Homepage
├── about.html              # (To be created)
├── menu.html               # (To be created)
├── apparel.html            # Printify shop
├── contact.html            # (To be created)
├── careers.html            # (To be created)
├── css/
│   ├── variables.css       # Design tokens
│   └── main.css            # Main styles
├── js/
│   ├── main.js             # Core functionality
│   └── printify.js         # Printify integration
├── images/                 # Add your images here
├── README.md               # Project overview
├── SETUP.md               # This file
├── package.json           # Project config
└── .gitignore             # Git ignore rules
```

## Design Guidelines

### Color Usage
- **Primary Pink (#FFB6C1)**: Buttons, accents, highlights
- **Gold (#D4AF37)**: Premium elements, CTAs, borders
- **White/Cream**: Backgrounds, cards
- **Text Dark (#4A4A4A)**: Primary text

### Typography
- **Headings**: Playfair Display (elegant, serif)
- **Body**: Montserrat (clean, readable)
- **Accents**: Dancing Script (handwritten feel)

### Component Patterns
- Use `.card` for content blocks
- Use `.btn` classes for buttons (primary, secondary, outline)
- Use `.section-header` for section titles
- Keep mobile-first responsive design

## Helpful Commands

```bash
# Start development server
npm start

# View in browser
open http://localhost:8000

# Check file structure
tree -L 2

# Commit changes
git add .
git commit -m "Description of changes"
```

## Integration Notes

### Printify Products
- Products load dynamically from Printify API
- Modal system for product details
- Variant selection (sizes, colors)
- Add to cart functionality

### DoorDash Ordering
- Link opens in new tab
- Can be customized per product if needed

### Social Media
- Facebook: https://www.facebook.com/icingforizaac
- Instagram: https://www.instagram.com/icingforizaac
- Pinterest: https://www.pinterest.com/icingforizaac

## Tips for Claude Code

1. **Maintain Consistency**: Use existing color variables and component classes
2. **Keep It Boutique**: Elegant, not overly complex
3. **Mobile First**: Test on small screens
4. **Performance**: Optimize images before adding
5. **Accessibility**: Use semantic HTML and ARIA labels

## Resources

- **Color Palette**: See `css/variables.css`
- **Font Awesome Icons**: https://fontawesome.com/icons
- **Printify API Docs**: https://developers.printify.com
- **Inspiration**: Cake Bake Shop aesthetic

## Questions?

If you need clarification on any part of the structure or design decisions, refer to:
- `README.md` for project overview
- `css/variables.css` for design tokens
- Existing HTML for component patterns
- `js/main.js` for functionality reference

Happy coding! 🍰✨