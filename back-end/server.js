const express = require('express');
const {OpenAI} = require('langchain/llms/openai');
const {BufferMemory} = require('langchain/memory');
const {ConversationChain} = require('langchain/chains');
require('dotenv').config();
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, './dist')));

let model, memory, chain;

app.post('/api/prompt', async (req, res) => {
    let input = req.body.input;
    if(req.body.firstMessage) {
        model = new OpenAI({openAIApiKey:process.env.OPENAI_API_KEY, modelName: 'gpt-3.5-turbo'});
        memory = new BufferMemory();
        chain = new ConversationChain({llm: model, memory});
    }
    let output = await chain.call({input});
    res.json(output.response);
});

app.listen(8000, ()=> {
    console.log('server is listening as port: 8000');
})