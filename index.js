const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

// Using middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3tai1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const todoCollection = client.db('Simple-ToDo').collection('todo-List');

        app.post('/addTodo', async (req, res) => {
            const todo = req.body;
            console.log(todo)
            const result = await todoCollection.insertOne(todo);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Simple todo is up and running')
})

app.listen(port, () => {
    console.log(`Simple todo is up and running on ${port}`)
})