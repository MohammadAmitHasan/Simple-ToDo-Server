const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');

// Using middleware
app.use(cors())
app.use(express.json())

// function to verify jwt
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized access' })
    }
    const token = authHeader.split(' ')[1];
    // Check the token validity
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next()
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3tai1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const todoCollection = client.db('Simple-ToDo').collection('todo-List');

        // POST API
        app.post('/addTodo', async (req, res) => {
            const todo = req.body;
            const result = await todoCollection.insertOne(todo);
            res.send(result)
        })

        // All todo API
        app.get('/todos', verifyJWT, async (req, res) => {
            const todos = await todoCollection.find({}).sort({ '_id': -1 }).toArray();
            res.send(todos);
        })

        // Delete a todo API
        app.delete('/todo/:id', verifyJWT, async (req, res) => {
            const todoId = req.params.id;
            const filter = { _id: ObjectId(todoId) }
            const result = await todoCollection.deleteOne(filter);
            res.send(result);
        })

        // Update a todo API
        app.put('/todo/:id', verifyJWT, async (req, res) => {
            const todoId = req.params.id;
            const updatedToDo = req.body;
            const filter = { _id: ObjectId(todoId) }
            const options = { upsert: true };

            const updateDoc = {
                $set: updatedToDo
            }
            // Update data in MongoDB
            const result = await todoCollection.updateOne(filter, updateDoc, options);
            res.send(result);
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