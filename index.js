const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config()
const app = express();
const port = 3000;
const cors=require('cors')

app.use(cors())
app.use(bodyParser.json());
// Your OpenAI API key
const openaiApiKey = process.env.key;

// Route 1: Make a request to OpenAI API taking prompt from the body
app.get("/",(req,res)=>{
    res.json("welcome")
})
app.post('/api/route1', async (req, res) => {
    try {
        let { prompt ,language} = req.body;
        prompt=`Convert this code ${prompt} to ${language} and give only the code.`
        console.log(prompt,language);
        const response = await makeOpenAIRequest(prompt);
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

// Route 2: Make a request to OpenAI API taking prompt from the body and debug it
app.post('/api/route2', async (req, res) => {
    try {
        let { prompt } = req.body;
        prompt=`Debug this code ${prompt} correct if any errors.`
        const response = await makeOpenAIRequest(prompt);
        // Add your debug logic here (if needed)
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

// Route 3: Make a request to OpenAI API taking prompt from the body and analyze code quality
app.post('/api/route3', async (req, res) => {
    try {
        let { prompt } = req.body;
        prompt=`Check the quality of the code ${prompt}`
        const response = await makeOpenAIRequest(prompt);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

// Helper function to make a request to OpenAI API
// Helper function to make a request to OpenAI API
async function makeOpenAIRequest(prompt) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions'; // Correct API endpoint
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
    };
    const body = {
        model: 'gpt-3.5-turbo', // You can use 'gpt-3.5-turbo' or other suitable models
        messages: [
            {
                role: 'system',
                content: 'You are a senior backend developer assisting with OpenAI chat completions.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    };

    const response = await axios.post(apiUrl, body, { headers });
    return response.data.choices[0].message.content;
}


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
