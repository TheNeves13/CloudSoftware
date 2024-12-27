const express = require('express');
const axios = require('axios');
const fs = require('fs');
const multer = require('multer');
const readline = require('readline');

const router = express.Router();
const SUPABASE_URL = "https://xkmhhknchcyavaxtojdu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbWhoa25jaGN5YXZheHRvamR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNjU5MTEsImV4cCI6MjA0OTk0MTkxMX0.0jNL_QikMs4cMTWBBhKWBS5okMG0mASHPFUig2zS6Jk";

const upload = multer({ dest: 'uploads/' });

router.post('/livrosAno', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const rows = [];

    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        output: process.stdout,
        terminal: false
    });

    let headerSkipped = false;

    rl.on('line', (line) => {

        if (!headerSkipped) {
            headerSkipped = true;
            return;
        }

        const columns = line.trim().split(/\s+/);

        if (columns.length === 2) {
            const year = columns[0];
            const bookCount = columns[1];

            rows.push({ year, book_count: bookCount });
        }
    });

    rl.on('close', async () => {
        try {
            const response = await axios.post(
                `${SUPABASE_URL}/rest/v1/searchresult`,
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

            res.json({ message: 'Arquivo TXT processado e dados enviados ao Supabase com sucesso', data: response.data });
        } catch (error) {
            console.error('Erro ao enviar os dados para o Supabase:', error.response ? error.response.data : error.message);
            res.status(500).send('Erro ao enviar os dados para o Supabase');
        }
    });

    rl.on('error', (error) => {
        fs.unlinkSync(filePath);
        res.status(500).send('Erro ao processar o arquivo TXT');
    });
});

router.delete('/deleteLivroAno', async (req, res) => {
    try {
        // Elimina a tabela searchresult
        const response = await axios.delete(
            `${SUPABASE_URL}/rest/v1/searchresult?year=eq.2023`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({ message: 'Tabela "searchresult" apagada com sucesso', data: response.data });
    } catch (error) {
        console.error('Erro ao apagar os dados da tabela:', error.response ? error.response.data : error.message);
        res.status(500).send('Erro ao apagar os dados da tabela');
    }
});


module.exports = router;
