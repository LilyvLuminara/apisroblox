const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/search', async (req, res) => {
    const query = req.query.q; // Ambil parameter pencarian
    
    if (!query) return res.status(400).send("Masukkan parameter 'q'");

    try {
        // Melakukan request ke Roblox API
        const response = await axios.get(`https://apis.roblox.com/toolbox-service/v2/assets:search`, {
            params: { q: query, limit: 10 },
            headers: {
                'User-Agent': 'RobloxProxy/1.0', // Header penting agar tidak dianggap bot
                'Accept': 'application/json'
            }
        });

        // Mengirim data balik ke script Roblox kamu
        res.json(response.data);
    } catch (error) {
        res.status(500).send("Error saat mengambil data dari Roblox API");
    }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

