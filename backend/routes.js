const express = require("express");
const axios = require("axios");
const router = express.Router();

const SUPABASE_URL = "https://xkmhhknchcyavaxtojdu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbWhoa25jaGN5YXZheHRvamR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNjU5MTEsImV4cCI6MjA0OTk0MTkxMX0.0jNL_QikMs4cMTWBBhKWBS5okMG0mASHPFUig2zS6Jk";

router.get('/livrosAno/:year', async (req, res) => {
    const { year } = req.params;  // Recupera o ano da URL
    try {
        // Procura informações por dado especifico
        const response = await axios.get(
            `${SUPABASE_URL}/rest/v1/searchresult?year=eq.${year}`,  // Filtra por ano
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Se houver registos para o ano especifico, retornar os dados
        if (response.data.length > 0) {
            res.json({ message: `Dados para o ano ${year} encontrados`, data: response.data });
        } else {
            res.status(404).json({ message: `Nenhum dado encontrado para o ano ${year}` });
        }
    } catch (error) {
        console.error('Erro ao buscar dados para o ano:', error.response ? error.response.data : error.message);
        res.status(500).send('Erro ao buscar dados para o ano');
    }
});


// POST para adicionar catálogo
router.post("/addCatalog", async (req, res) => {
    const { year, title, language, authors } = req.body;
    if (!year || !title || !language || !authors) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const response = await axios.post(
            `${SUPABASE_URL}/rest/v1/catalog`,
            { year, title, language, authors },
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error adding catalog:', error.response ? error.response.data : error.message);
        res.status(500).send('Error adding catalog');
    }
});

// GET para procurar todos os catálogos
router.get("/catalogs", async (req, res) => {
    try {
        const response = await axios.get(`${SUPABASE_URL}/rest/v1/catalog`, {
            headers: {
                apikey: SUPABASE_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// PUT para atualizar um catálogo
router.put("/updateCatalog/:id", async (req, res) => {
    const { id } = req.params;
    const { year, title, language, authors } = req.body;
    if (!year || !title || !language || !authors) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const response = await axios.put(
            `${SUPABASE_URL}/rest/v1/catalog?id=eq.${id}`,
            {id, year, title, language, authors }, 
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    "Content-Type": "application/json",
                },
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('Error updating catalog:', error.response ? error.response.data : error.message);
        res.status(500).send('Error updating catalog');
    }
});

// DELETE para excluir um catálogo
router.delete("/deleteCatalog/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.delete(
            `${SUPABASE_URL}/rest/v1/catalog?id=eq.${id}`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                },
            }
        );
        res.json({ message: "Catalogo eliminado com sucesso!" });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET para procurar um catálogo específico
router.get("/catalogs/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const response = await axios.get(
            `${SUPABASE_URL}/rest/v1/catalog?id=eq.${id}`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                },
            }
        );
        
        if (response.data.length > 0) {
            res.json(response.data[0]);
        } else {
            res.status(404).send("Catalogo não encontrado");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
