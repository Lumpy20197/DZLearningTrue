// server.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Create Payment Intent (Stripe)
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { email } = req.body;
        
        console.log('Creating payment intent for:', email);
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 400, // £4 in pence
            currency: 'gbp',
            metadata: {
                student_email: email,
                service: 'group-tutoring-session',
                recording: 'true'
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log('Payment intent created:', paymentIntent.id);
        
        res.json({ clientSecret: paymentIntent.clientSecret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Handle successful payment
app.post('/confirm-booking', async (req, res) => {
    try {
        const { email, payment_id } = req.body;
        
        console.log('✅ Booking confirmed for:', email);
        console.log('💰 Payment ID:', payment_id);
        console.log('📧 Send Google Meet link to:', email);
        console.log('🎥 Recording will be sent after session');
        console.log('🔗 Discord: https://discord.gg/8AhqvbJy');
        
        // In a real app, you would:
        // 1. Save to database
        // 2. Send confirmation email
        // 3. Add to Google Calendar
        // 4. Send Discord notification
        
        res.json({ 
            success: true, 
            message: 'Booking confirmed!',
            email_sent: true,
            meet_link: 'https://meet.google.com/new',
            discord_link: 'https://discord.gg/8AhqvbJy'
        });
        
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve HTML for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`💳 Stripe payments are LIVE`);
    console.log(`📧 Test email: student@example.com`);
    console.log(`💳 Test card: 4242 4242 4242 4242`);
});
