const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).send("Masukkan parameter q");

    try {
        // Menggunakan Roproxy agar tidak diblokir
        const url = `https://apis.roproxy.com/toolbox-service/v2/assets:search?searchCategoryType=Model&query=${encodeURIComponent(query)}&maxPageSize=20`;
        
        const response = await axios.get(url);

        // Memperbaiki jalur data ke 'creatorStoreAssets' sesuai struktur API Roblox
        const items = response.data.creatorStoreAssets || [];
        
        const formattedData = items.map(item => ({
            name: item.asset.name,
            id: item.asset.id
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

// Penanganan rute agar tidak 404
app.get('*', (req, res) => res.send('API Aktif. Gunakan /search?q=sakura'));

module.exports = app;
