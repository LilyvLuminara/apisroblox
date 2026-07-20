const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        // MENAMBAHKAN HEADERS PENTING DISINI
        const response = await axios.get('https://apis.roblox.com/toolbox-service/v2/assets:search', {
            params: {
                searchCategoryType: 'Model',
                query: query,
                maxPageSize: 20
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.roblox.com/',
                'Origin': 'https://www.roblox.com'
            }
        });

        // Mengirimkan data jika berhasil
        res.json(response.data.data.map(item => ({
            name: item.asset.name,
            id: item.asset.id
        })));
    } catch (error) {
        res.status(500).send("Error API: " + error.message);
    }
});

module.exports = app;
