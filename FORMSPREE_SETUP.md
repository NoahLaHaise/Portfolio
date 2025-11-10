# Contact Form Setup with Formspree

Your contact form is now configured to send emails using Formspree. Follow these steps to complete the setup:

## Step 1: Create a Formspree Account

1. Go to [https://formspree.io/](https://formspree.io/)
2. Click "Sign Up" (it's free for up to 50 submissions per month)
3. Create an account with your email address

## Step 2: Create a New Form

1. After logging in, click "New Form" or "+" button
2. Give your form a name (e.g., "Portfolio Contact Form")
3. Enter the email address where you want to receive contact form submissions
4. Click "Create Form"

## Step 3: Get Your Form ID

1. After creating the form, you'll see a form endpoint that looks like:
   ```
   https://formspree.io/f/YOUR_FORM_ID
   ```
2. Copy the entire URL or just the form ID (the part after `/f/`)

## Step 4: Update Your Contact Form

1. Open `contact.html` in your text editor
2. Find this line (around line 70):
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
3. Replace `YOUR_FORM_ID` with your actual Formspree form ID
4. Save the file

## Step 5: Test Your Form

1. Deploy your changes to GitHub Pages
2. Go to your contact page
3. Fill out and submit the form
4. You should receive an email with the form submission!

## Features Included

✅ **Email notifications** - Get submissions sent directly to your email
✅ **AJAX submission** - Form submits without page reload
✅ **Loading state** - Button shows "Sending..." while submitting
✅ **Success/Error messages** - User-friendly feedback
✅ **Spam protection** - Formspree includes built-in spam filtering
✅ **Form validation** - Client-side validation before submission

## Optional: Customize Formspree Settings

In your Formspree dashboard, you can:
- Set up email notifications with custom templates
- Add reCAPTCHA for additional spam protection
- Configure auto-response emails to people who submit the form
- View submission history
- Export submissions to CSV

## Troubleshooting

**Form not sending emails?**
- Make sure you replaced `YOUR_FORM_ID` with your actual form ID
- Check that your email address is verified in Formspree
- Look in your spam folder for the confirmation email

**Getting errors?**
- Check browser console for error messages
- Verify the form action URL is correct
- Make sure you're not exceeding Formspree's free tier limit (50 submissions/month)

## Alternative: EmailJS

If you prefer not to use Formspree, you can also use [EmailJS](https://www.emailjs.com/) which offers:
- 200 free emails per month
- Direct email sending from JavaScript
- Template customization
- Multiple email services support

Let me know if you need help setting up EmailJS instead!
