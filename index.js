'use strict';
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
    origin: function(origin, callback) {
        // Allow any onslate.com subdomain and local dev
        if (!origin || origin.endsWith('.onslate.com') || origin === 'http://localhost:5173') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

const CATALYST_URL = 'https://restaurant-918550118.development.catalystserverless.com/server/restaurant_function/dish';

app.post('/dish', async (req, res) => {
    try {
        const response = await fetch(CATALYST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy failed to reach Catalyst' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
