const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b699yx9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const categoryCollection = client.db('furniFurniture').collection('categories');
        const bookingsCollection = client.db('furniFurniture').collection('bookings');
        const buyersCollection = client.db('furniFurniture').collection('buyers');

        app.get('/categories', async(req, res) =>{
            const query = {}
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        });
        app.get('/categories/:id', async(req, res) =>{
              const id = req.params.id;
              const query = {_id: ObjectId(id)}
              const category = await categoryCollection.findOne(query);
              res.send(category);
        });

        app.get('/bookings', async(req, res) =>{
            const email = req.query.email;
            const query = {email: email};
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
        })
        app.post('/bookings', async(req, res)=>{
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })
        app.post('/buyers', async(req, res) =>{
            const buyer = req.body;
            const result = await buyersCollection.insertOne(buyer);
            res.send(result);
        })
    }
    finally{

    }
}


run().catch(error => console.log(error));

app.get('/', (req, res) =>{
    res.send('FurniFurniture Server is running');
})

app.listen(port, () =>{
    console.log(`FurniFurniture server is running on port ${port}`);
})