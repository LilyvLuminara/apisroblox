const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Halaman utama buat tes
app.get('/', (req, res) => {
    res.send('Proxy Toolbox Service Aktif!');
});

// Rute Search Baru sesuai API pilihanmu
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).send("Masukkan parameter 'q'");

    try {
        // Menembak API pilihanmu lewat server Vercel (Bypass Blocked)
        const response = await axios.get('https://apis.roblox.com/toolbox-service/v2/assets:search', {
            params: {
                searchCategoryType: 'Model',
                query: query,
                maxPageSize: 20
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });

        // Ambil data array dari "data" bawaan Roblox
        const rawItems = response.data.data || [];
        
        // Bungkus ulang agar formatnya seragam & gampang dibaca oleh script Roblox
        const formattedData = rawItems.map(item => {
            if (item.asset) {
                return {
                    name: item.asset.name || "Unknown Model",
                    id: item.asset.id
                };
            }
            return null;
        }).filter(item => item !== null);

        res.json(formattedData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error saat mengambil data dari Toolbox API");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
