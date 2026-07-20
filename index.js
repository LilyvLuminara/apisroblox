const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).send("Masukkan parameter q");

    try {
        // Kita gunakan roproxy.com agar tidak diblokir oleh Roblox
        const url = `https://apis.roproxy.com/toolbox-service/v2/assets:search?searchCategoryType=Model&query=${encodeURIComponent(query)}&maxPageSize=20`;
        
        const response = await axios.get(url);

        // Memproses data agar bersih untuk script kamu
        const items = response.data.data || [];
        const result = items.map(item => ({
            name: item.asset.name,
            id: item.asset.id
        }));

        res.json(result);
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

module.exports = app;
