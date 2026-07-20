const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware agar website/game kamu bisa mengakses server ini
app.use(cors());

// Rute utama untuk testing (supaya tidak error Cannot GET /)
app.get('/', (req, res) => {
    res.send('Server Proxy Roblox Aktif! Gunakan /search?q=keyword untuk mencari.');
});

// Rute pencarian model
app.get('/search', async (req, res) => {
    const query = req.query.q;
    
    if (!query) return res.status(400).send("Masukkan parameter 'q'");

    try {
        // Menggunakan Catalog API Resmi Roblox
        const response = await axios.get(`https://catalog.roblox.com/v1/search/items`, {
            params: {
                keyword: query,
                category: "FreeModels",
                limit: 10
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json'
            }
        });

        const items = response.data.data || [];
        const formattedData = items.map(item => ({
            Name: item.name,
            Id: item.id
        }));

        res.json(formattedData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error saat mengambil data dari API");
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
