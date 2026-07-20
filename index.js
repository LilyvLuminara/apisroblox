 const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Tambahkan ini agar tidak kena CORS error

const app = express();
app.use(cors()); // Mengizinkan akses dari luar (Roblox)

// Rute utama agar tidak 404 saat dibuka di browser
app.get('/', (req, res) => {
    res.send('Proxy Toolbox Service Aktif!');
});

// Rute pencarian
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).send("Masukkan parameter 'q'");

    try {
        const response = await axios.get('https://apis.roblox.com/toolbox-service/v2/assets:search', {
            params: {
                searchCategoryType: 'Model',
                query: query,
                maxPageSize: 20
            },
            headers: {
                'User-Agent': 'Mozilla/5.0' // Membantu agar tidak dianggap bot oleh Roblox
            }
        });

        // Modifikasi data agar formatnya bersih untuk Roblox
        const rawItems = response.data.data || [];
        const formattedData = rawItems.map(item => ({
            name: item.asset?.name || "Unknown",
            id: item.asset?.id
        }));

        res.json(formattedData); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// Vercel tidak membutuhkan app.listen(3000) secara manual, 
// tapi Vercel akan menangkap app sebagai export default
module.exports = app;
