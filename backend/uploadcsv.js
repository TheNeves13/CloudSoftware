const express = require('express');
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const multer = require('multer');

const router = express.Router();
const SUPABASE_URL = "https://xkmhhknchcyavaxtojdu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbWhoa25jaGN5YXZheHRvamR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNjU5MTEsImV4cCI6MjA0OTk0MTkxMX0.0jNL_QikMs4cMTWBBhKWBS5okMG0mASHPFUig2zS6Jk";


const upload = multer({ dest: 'uploads/' });

router.post('/uploadCsv', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const rows = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {

            const row = {
                year: data.YEAR,           // Ajustar para minusculo (supabase = "year")
                title: data.TITLE,
                language: data.LANGUAGE,
                authors: data.AUTHORS,
            };
            rows.push(row);
        })
        .on('end', async () => {
            try {

                const response = await axios.post(
                    `${SUPABASE_URL}/rest/v1/catalog`,
                    rows,
                    {
                        headers: {
                            apikey: SUPABASE_KEY,
                            "Authorization": `Bearer ${SUPABASE_KEY}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                fs.unlinkSync(filePath);

                res.json({ message: 'Arquivo CSV processado e dados enviados ao Supabase com sucesso', data: response.data });
            } catch (error) {
                console.error('Erro ao enviar os dados para o Supabase:', error.response ? error.response.data : error.message);
                res.status(500).send('Erro ao enviar os dados para o Supabase');
            }
        })
        .on('error', (error) => {
            fs.unlinkSync(filePath);
            res.status(500).send('Erro ao processar o arquivo CSV');
        });
});

module.exports = router;
