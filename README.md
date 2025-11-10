# Portfolio Website

A modern, responsive portfolio website built with HTML, CSS, and JavaScript. This portfolio features three main sections: Professional Resume, Creative Technology & Art projects, and Contact information.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional Resume Section**: Showcase your work experience, education, and skills
- **Creative Projects Gallery**: Display your creative technology and art projects
- **Contact Form**: Allow visitors to get in touch with you
- **Smooth Scrolling**: Enhanced navigation experience
- **Mobile-Friendly Navigation**: Hamburger menu for mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations

## Structure

```
Portfolio/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Stylesheet
├── js/
│   └── main.js        # JavaScript for interactivity
├── assets/            # For images and other assets
└── README.md          # This file
```

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Portfolio.git
   ```

2. Open `index.html` in your web browser to view the site locally

3. Edit the content in `index.html` to personalize:
   - Update hero section with your name and title
   - Add your work experience and education
   - Update skills section
   - Add your creative projects
   - Update contact information

### Customization

#### Update Personal Information

1. **Hero Section** (index.html:30-35): Change the welcome message and title
2. **Resume Section** (index.html:38-110): Add your work experience, education, and skills
3. **Creative Projects** (index.html:113-170): Add your projects with images and descriptions
4. **Contact Info** (index.html:173-215): Update email, location, and social media links

#### Customize Colors

Edit the CSS variables in `css/style.css` (lines 11-20):

```css
:root {
    --primary-color: #2563eb;     /* Main brand color */
    --secondary-color: #1e40af;   /* Secondary color */
    --accent-color: #3b82f6;      /* Accent color */
    /* ... other colors */
}
```

#### Add Your Images

1. Place your project images in the `assets/` folder
2. Update the image paths in the project cards (index.html)
3. Replace placeholder images with your actual project screenshots

## GitHub Pages Deployment

### Deploy Your Portfolio

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial portfolio setup"
   git push origin main
   ```

2. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click on **Settings**
   - Scroll to **Pages** section
   - Under **Source**, select your branch (usually `main`)
   - Select `/ (root)` as the folder
   - Click **Save**

3. Your site will be published at: `https://yourusername.github.io/Portfolio/`

### Custom Domain (Optional)

To use a custom domain:

1. Create a file named `CNAME` in the root directory
2. Add your domain name (e.g., `www.yourname.com`)
3. Configure your domain's DNS settings to point to GitHub Pages

## Making the Contact Form Functional

The contact form currently shows an alert message. To make it functional on GitHub Pages, integrate with one of these services:

### Option 1: Formspree
1. Sign up at [Formspree](https://formspree.io/)
2. Update the form action in `index.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### Option 2: EmailJS
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Follow their JavaScript integration guide
3. Update the form submission handler in `js/main.js`

### Option 3: Netlify Forms
If you host on Netlify instead of GitHub Pages, you can use their built-in forms feature.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Technologies Used

- HTML5
- CSS3 (with CSS Variables and Flexbox/Grid)
- Vanilla JavaScript (ES6+)
- No frameworks or libraries required

## License

This project is open source and available under the MIT License.

## Credits

Created by [Your Name] - Feel free to use this template for your own portfolio!

## Contact

- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- GitHub: [Your GitHub](https://github.com/yourusername)
