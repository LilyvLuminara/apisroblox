const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.send("Parameter q kosong!");

    try {
        // Menggunakan endpoint alternatif yang lebih umum
        const url = `https://apis.roproxy.com/toolbox-service/v2/assets:search?searchCategoryType=Model&query=${encodeURIComponent(query)}&maxPageSize=20`;
        
        console.log("Mencoba akses:", url); // Log untuk debug
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Roblox/Vercel-Proxy' }
        });

        // Debug log untuk melihat apa yang sebenarnya dikembalikan Roblox/Proxy
        console.log("Respon dari API:", JSON.stringify(response.data).substring(0, 500));

        if (response.data && response.data.data) {
            const result = response.data.data.map(item => ({
                name: item.asset.name,
                id: item.asset.id
            }));
            res.json(result);
        } else {
            res.send("API mengembalikan data kosong. Respon asli: " + JSON.stringify(response.data));
        }
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

module.exports = app;
