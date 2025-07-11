# SendGrid Email Collection Setup Guide

This guide will help you set up email collection for Resonant Earth Network using SendGrid.

## 🚀 Quick Setup Steps

### 1. Create SendGrid Account
1. Go to [SendGrid.com](https://sendgrid.com) and create a free account
2. Verify your email address
3. Complete the account setup process

### 2. Get Your API Key
1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Choose **Restricted Access** and give it a name like "Resonant Earth Website"
4. Grant the following permissions:
   - **Mail Send**: Full Access
   - **Marketing**: Full Access (for contact lists)
   - **Template Engine**: Full Access
5. Copy the API key (you won't see it again!)

### 3. Create Contact List
1. Go to **Marketing** → **Contacts**
2. Click **Create List**
3. Name it "Resonant Earth Waitlist"
4. Add custom fields:
   - `source` (Text) - Where they signed up from
   - `signup_date` (Date) - When they joined
   - `user_agent` (Text) - Browser info
   - `referrer` (Text) - Where they came from

### 4. Create Welcome Email Template
1. Go to **Email API** → **Dynamic Templates**
2. Click **Create a Dynamic Template**
3. Name it "Resonant Earth Welcome"
4. Add a version with this content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Resonant Earth Network!</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://your-domain.com/assets/rn-logo.png" alt="Resonant Earth Network" style="height: 60px;">
    </div>
    
    <h1 style="color: #10b981; text-align: center;">Welcome to the Future of Sustainable Living!</h1>
    
    <p>Hi {{first_name}},</p>
    
    <p>Thank you for joining the Resonant Earth Network waitlist! You're now part of a growing community of conscious individuals building the future of regenerative living.</p>
    
    <h2 style="color: #059669;">What's Next?</h2>
    <ul>
        <li>🏠 <strong>Early Access:</strong> You'll be first to know when $ECOSTAY tokens become available</li>
        <li>🌍 <strong>Location Updates:</strong> Get updates on our Palawan flagship and global expansion</li>
        <li>💧 <strong>Water Quality Reports:</strong> See our latest microplastic testing results</li>
        <li>🤝 <strong>Community Access:</strong> Join our Discord for real-time discussions</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://discord.gg/resonantearth" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold;">Join Our Discord</a>
    </div>
    
    <h2 style="color: #059669;">Learn More</h2>
    <p>While you wait, explore our comprehensive resources:</p>
    <ul>
        <li><a href="https://your-domain.com/tokenomics.html">How $ECOSTAY Tokens Work</a></li>
        <li><a href="https://your-domain.com/water-quality.html">Water Quality Research</a></li>
        <li><a href="https://your-domain.com/business-model.html">Global Expansion Plan</a></li>
    </ul>
    
    <p>Questions? Just reply to this email - we read every message!</p>
    
    <p>Welcome to the movement,<br>
    The Resonant Earth Team</p>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <p style="font-size: 12px; color: #6b7280; text-align: center;">
        You joined our waitlist on {{signup_date}}. 
        <a href="{{unsubscribe}}">Unsubscribe</a> | 
        <a href="https://your-domain.com">Visit Website</a>
    </p>
</body>
</html>
```

### 5. Set Up Your Backend

#### Option A: Vercel Serverless Function
Create `api/signup.js` in your project:

```javascript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, source } = req.body;

        // Add to contact list
        await sgMail.request({
            url: '/v3/marketing/contacts',
            method: 'PUT',
            body: {
                list_ids: [process.env.SENDGRID_LIST_ID],
                contacts: [{
                    email: email,
                    custom_fields: {
                        source: source,
                        signup_date: new Date().toISOString()
                    }
                }]
            }
        });

        // Send welcome email
        await sgMail.send({
            to: email,
            from: 'hello@resonantearth.network',
            templateId: process.env.SENDGRID_WELCOME_TEMPLATE_ID,
            dynamicTemplateData: {
                first_name: email.split('@')[0],
                signup_date: new Date().toLocaleDateString()
            }
        });

        res.json({ success: true, message: 'Successfully joined!' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}
```

#### Option B: Netlify Function
Create `netlify/functions/signup.js`:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { email, source } = JSON.parse(event.body);
        
        // Same logic as Vercel function above
        
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
```

### 6. Environment Variables
Set these in your hosting platform:

```
SENDGRID_API_KEY=your_api_key_here
SENDGRID_LIST_ID=your_list_id_here
SENDGRID_WELCOME_TEMPLATE_ID=your_template_id_here
```

### 7. Update Frontend Configuration
In `website/assets/email-signup.js`, update the API endpoint:

```javascript
constructor() {
    this.apiEndpoint = '/api/signup'; // Vercel
    // OR
    this.apiEndpoint = '/.netlify/functions/signup'; // Netlify
    this.init();
}
```

## 📊 Testing Your Setup

1. **Test the form** on your website
2. **Check SendGrid contacts** to see if emails are added
3. **Verify welcome emails** are sent
4. **Test error handling** with invalid emails

## 🔧 Advanced Features

### Segmentation
Create different lists for different sources:
- Homepage signups
- Tokenomics page signups  
- Business model page signups

### Automation
Set up email sequences in SendGrid:
1. Welcome email (immediate)
2. Project update (1 week later)
3. Token launch notification (when ready)

### Analytics
Track signup sources and conversion rates:
- Add UTM parameters to links
- Use SendGrid's analytics dashboard
- Set up Google Analytics events

## 🚨 Important Notes

- **Never expose your API key** in frontend code
- **Always validate emails** on both frontend and backend
- **Handle errors gracefully** with user-friendly messages
- **Comply with GDPR/privacy laws** in your region
- **Test thoroughly** before going live

## 📞 Support

If you need help:
1. Check SendGrid's documentation
2. Test with their API explorer
3. Contact SendGrid support for API issues
4. Review the browser console for JavaScript errors

Your email collection system is now ready to capture leads for Resonant Earth Network! 🌱
