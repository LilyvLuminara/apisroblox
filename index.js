const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).send("Masukkan keyword!");

    try {
        const response = await axios.get('https://apis.roblox.com/toolbox-service/v2/assets:search', {
            params: {
                searchCategoryType: 'Model',
                query: query,
                maxPageSize: 20
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.roblox.com/',
                'Origin': 'https://www.roblox.com'
            }
        });

        // PERBAIKAN DI SINI: Kita tambahkan pengecekan apakah response.data dan response.data.data ada
        const items = (response.data && response.data.data) ? response.data.data : [];

        // Kalau items kosong, kita kirim array kosong biar Roblox tidak crash
        const formattedData = items.map(item => ({
            name: item.asset ? item.asset.name : "Unknown",
            id: item.asset ? item.asset.id : null
        }));

        res.json(formattedData);
    } catch (error) {
        console.error("Detail Error:", error.message);
        res.status(500).send("Error API: " + error.message);
    }
});

module.exports = app;
