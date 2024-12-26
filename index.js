const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// 
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uurflxx.mongodb.net/?retryWrites=true&w=majority`;



console.log(uri);

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
    // await client.connect();
    const craftCollection = client.db("woodyDB").collection("crafts");
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    app.post('/add', async(req, res)=>{
        const newCraft = req.body;
        console.log(newCraft);
        const result = await craftCollection.insertOne(newCraft)
        console.log(result);
        res.send(result);
    })

    app.get('/myItem/:email', async(req, res) => {
       console.log(req.params.email);
       const result =await craftCollection.find({email:req.params.email}).toArray();
       res.send(result)
    })
    
    app.get('/all', async(req, res) =>{
       const cursor = craftCollection.find();
       const result = await cursor.toArray() 
       res.send(result)
    })

    app.get('/singleItem/:id', async(req, res) =>{
       const result = await craftCollection.findOne({_id: new ObjectId(req.params.id),});
       console.log(result);
       res.send(result)
    })
    
    app.put('/updateItem/:id', async (req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updated = req.body;
      const data = {
        $set:{
          name:updated.name,
          category: updated.category,
          price: updated.price,
          rating: updated.rating,
          customization: updated.customization,
          time: updated.time,
          stock: updated.stock,
          description: updated.description,
          photo: updated.photo
        }
      }
      
      const result = await craftCollection.updateOne(filter, data, options);
      console.log(result);
      res.send(result);
    })
    
    app.delete('/delete/:id', async (req, res)=>{
       const result = await craftCollection.deleteOne({_id: new ObjectId(req.params.id)})
       console.log(result);
       res.send(result);
    })
    
   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running')
})
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})


