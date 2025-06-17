// server.js
const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.options('/dialogflow', cors());

const projectId = 'silver-osprey-462817-p7';  // Reemplazá con tu Project ID de Google Cloud
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
const sessionClient = new dialogflow.SessionsClient({ credentials });

app.post('/dialogflow', async (req, res) => {
    const sessionId = uuid.v4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
    const query = req.body.query;

    const request = {
    session: sessionPath,
    queryInput: {
        text: {
        text: query,
        languageCode: 'es',
        }
    }
    };

    try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText });
    } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).json({ reply: 'Error al conectar con Dialogflow' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor backend escuchando en puerto ${port}`);
});
