const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, AggregationCursor } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pzlo6ar.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('homeMadeFood').collection('services');
        const reviewCollection = client.db('homeMadeFood').collection('review');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/serviceLimit', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const serviceLimit = await cursor.limit(3).toArray();
            res.send(serviceLimit);
        });


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });


        // review api create and stored database

        app.get('/reviews', async (req, res) => {

            let query = {};
            if (req.query.serviceName) {
                query = {
                    ServiceName: req.query.serviceName
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });


        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(_id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(error => console.error(error));




app.get('/', (req, res) => {
    res.send('homeMade foodStore server is running');
})

app.listen(port, () => {
    console.log(`homeMade foodStore  server running on ${port}`);
})
