const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', (res,req)=>{
    req.send('job is fallen from the sky')
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wld9ndi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const postCollections = client.db('wishperWall').collection('wishpers');
    const voteCollections = client.db('wishperWall').collection('vote');

    app.get('/posts', async(req,res)=>{
      const cursor = postCollections.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.post('/posts',async(req,res)=>{
      const post = req.body;
      const result = await postCollections.insertOne(post);
      res.send(result)
    })

    app.get('/votes', async(req,res)=>{
      const cursor = voteCollections.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.post('/votes', async(req,res)=>{
      const vote = req.body;
      
      console.log(vote)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, ()=>{
    console.log(port)
})
