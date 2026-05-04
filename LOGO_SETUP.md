# Logo Setup Instructions

## Required Logo Files

To display the logos in the ISE Department portal, you need to place the following image files in the **public** directory at the root of the project:

### File 1: BMSCE College Logo
- **Filename:** `logo-bmsce.png`
- **Location:** `/public/logo-bmsce.png`
- **Size:** Recommended 40x40px or similar square aspect ratio
- **Format:** PNG with transparency

### File 2: ISE Department Logo  
- **Filename:** `logo-ise.png`
- **Location:** `/public/logo-ise.png`
- **Size:** Recommended 40x40px or similar square aspect ratio
- **Format:** PNG with transparency

## Where Logos Appear

1. **Sidebar Header (Desktop & Tablet)**: Both logos appear side-by-side in the sidebar brand section at the top, next to the "ISE Department" text and "BMS College of Engineering" tagline.

2. **Mobile Navigation**: Logos are scaled down appropriately and shown in the horizontal mobile navigation bar.

## File Structure

```
research-portal/
├── public/
│   ├── logo-bmsce.png        ← Place BMSCE logo here
│   └── logo-ise.png          ← Place ISE Department logo here
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   └── ...
└── index.html
```

## Styling

The logos are automatically styled with:
- Brightness enhancement for better visibility on dark backgrounds
- Responsive sizing that adapts to different screen sizes
- Proper spacing and alignment with department branding

## Image Preparation

For best results:
- Use PNG format with transparent background
- Make sure logos are square (1:1 aspect ratio) for consistent display
- Keep file size under 100KB each
- Test on both light and dark backgrounds

## Responsive Behavior

- **Desktop (>768px):** Logos are 40x40px with normal spacing
- **Tablet (768px):** Logos are 28x28px  
- **Mobile (<480px):** Logos are 24x24px for space efficiency
