// SendGrid Email Signup API Endpoint
// This is a Node.js/Express example - adapt for your backend framework

const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key (use environment variable for security)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Your SendGrid contact list ID (create this in SendGrid dashboard)
const CONTACT_LIST_ID = process.env.SENDGRID_LIST_ID;

async function addContactToSendGrid(email, source, metadata = {}) {
    try {
        const contactData = {
            list_ids: [CONTACT_LIST_ID],
            contacts: [
                {
                    email: email,
                    custom_fields: {
                        // Define these custom fields in your SendGrid account
                        source: source,
                        signup_date: new Date().toISOString(),
                        user_agent: metadata.userAgent || '',
                        referrer: metadata.referrer || ''
                    }
                }
            ]
        };

        const response = await sgMail.request({
            url: '/v3/marketing/contacts',
            method: 'PUT',
            body: contactData
        });

        return { success: true, response };
    } catch (error) {
        console.error('SendGrid error:', error);
        throw error;
    }
}

async function sendWelcomeEmail(email) {
    try {
        const msg = {
            to: email,
            from: {
                email: 'hello@resonantearth.network',
                name: 'Resonant Earth Network'
            },
            templateId: process.env.SENDGRID_WELCOME_TEMPLATE_ID, // Create this template in SendGrid
            dynamicTemplateData: {
                subject: 'Welcome to Resonant Earth Network!',
                first_name: email.split('@')[0], // Simple fallback
                signup_date: new Date().toLocaleDateString(),
                // Add more personalization data as needed
            }
        };

        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error('Welcome email error:', error);
        // Don't throw here - we still want to add to list even if email fails
        return { success: false, error: error.message };
    }
}

// Express.js endpoint example
async function handleSignup(req, res) {
    try {
        const { email, source, userAgent, referrer } = req.body;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Add to SendGrid contact list
        await addContactToSendGrid(email, source, { userAgent, referrer });

        // Send welcome email
        const emailResult = await sendWelcomeEmail(email);

        // Log signup for analytics
        console.log('New signup:', {
            email,
            source,
            timestamp: new Date().toISOString(),
            welcomeEmailSent: emailResult.success
        });

        res.json({
            success: true,
            message: 'Successfully joined the waitlist!',
            welcomeEmailSent: emailResult.success
        });

    } catch (error) {
        console.error('Signup error:', error);
        
        // Check if it's a duplicate contact error
        if (error.response && error.response.body && 
            error.response.body.errors && 
            error.response.body.errors.some(e => e.message.includes('duplicate'))) {
            return res.status(200).json({
                success: true,
                message: 'You\'re already on our waitlist!'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.'
        });
    }
}

// Alternative: Serverless function (Vercel/Netlify)
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

    return handleSignup(req, res);
}

// Environment variables you'll need:
/*
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_LIST_ID=your_contact_list_id_here
SENDGRID_WELCOME_TEMPLATE_ID=your_welcome_template_id_here
*/

// Package.json dependencies:
/*
{
  "dependencies": {
    "@sendgrid/mail": "^7.7.0",
    "express": "^4.18.0"
  }
}
*/
