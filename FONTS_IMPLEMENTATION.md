# MediAI Pharmacy Landing Page - Font Implementation Guide

## Overview
This document outlines the unified font system implemented across all components of the MediAI Pharmacy landing page.

## Font Stack

### 1. **Bebas Neue** (`font-bebas`)
- **Usage**: Large section headings, banner text
- **Examples**: "How We're Different", "User FeedBack", "Get In Touch"
- **Classes**: `font-bebas`

### 2. **Playfair Display** (`font-playfair`)
- **Usage**: Hero headlines, card titles, styled headings
- **Examples**: Main hero title, feature card headings, "MediAI" signature
- **Classes**: `font-playfair`
- **Weights**: 400, 700, 900

### 3. **Inter** (`font-inter`)
- **Usage**: Body text, descriptions, form labels, buttons
- **Examples**: Paragraph text, form inputs, button text
- **Classes**: `font-inter`
- **Weights**: 300, 400, 500, 600, 700

### 4. **Kalam** (`font-kalam`)
- **Usage**: Decorative elements, highlights, playful text
- **Examples**: "Health" badge in hero section
- **Classes**: `font-kalam`
- **Weights**: 400, 700

### 5. **Copernicus Book Regular** (`font-copernicus`)
- **Usage**: Special branded sections, call-to-action text
- **Examples**: Footer call-to-action section
- **Classes**: `font-copernicus`

## Implementation Status

### ✅ PharmacyLanding.jsx
- Font loading via useEffect ✅
- Consistent font classes throughout ✅
- Proper typography hierarchy ✅
- Copernicus font for special sections ✅

### ✅ About.jsx
- Font loading via useEffect ✅
- Bebas Neue for main heading ✅
- Inter for body text ✅
- Playfair for signature ✅

### ✅ Hero.jsx
- Font loading via useEffect ✅
- Playfair for main headline ✅
- Kalam for decorative "Health" badge ✅
- Inter for description and buttons ✅

### ✅ Global Configuration
- fonts.css utility file ✅
- Tailwind config updated ✅
- CSS import in index.css ✅

## Font Loading Strategy

All components implement font loading via useEffect:

```javascript
useEffect(() => {
  // Load Google Fonts
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=Kalam:wght@400;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  // Add Copernicus font
  const copernicusStyle = document.createElement("style");
  copernicusStyle.textContent = `
    @font-face {
      font-family: 'Copernicus Book Regular';
      src: local('Copernicus Book Regular'), local('Copernicus-Book-Regular');
      font-display: swap;
    }
  `;
  document.head.appendChild(copernicusStyle);
}, []);
```

## Typography Hierarchy

1. **Hero Headlines**: `font-playfair font-semibold` + large text sizes
2. **Section Titles**: `font-bebas` + tracking-wide
3. **Card Titles**: `font-playfair font-bold`
4. **Body Text**: `font-inter` + various weights
5. **Buttons**: `font-inter font-semibold`
6. **Decorative**: `font-kalam font-bold`
7. **Special Sections**: `font-copernicus`

## Consistency Benefits

- **Unified brand experience** across all components
- **Improved readability** with proper font hierarchy
- **Better performance** with optimized font loading
- **Maintainable code** with consistent class usage
- **Accessible typography** with proper contrast and sizing

## Tailwind Classes Available

```css
font-bebas      /* Bebas Neue */
font-playfair   /* Playfair Display */
font-inter      /* Inter */
font-kalam      /* Kalam */
font-copernicus /* Copernicus Book Regular */
```

## Files Modified

1. `/src/components/PharmacyLanding.jsx` - Already had fonts
2. `/src/components/_components/About.jsx` - Added font loading & classes
3. `/src/components/_components/Hero.jsx` - Added font loading & classes
4. `/src/styles/fonts.css` - New utility file
5. `/src/index.css` - Added fonts import
6. `/tailwind.config.js` - Added font families

All components now use the same font system for a cohesive, professional appearance.
