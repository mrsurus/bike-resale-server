const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzh9xhl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 async function  run(){
    try{
        const categoryCollection = client.db("bikeResale").collection("category")
        const productsCollection = client.db("bikeResale").collection("products")

        app.get('/category', async(req,res)=>{
            const query = {}
            const result = await categoryCollection.find(query).toArray()
            res.send(result);
        })
        app.get('/products/:brand', async(req,res)=>{
            const brand = req.params.brand
            const query = {brand: brand}
            const result = await productsCollection.find(query).toArray()
            res.send(result);
        })

    }
    finally{

    }

}
run().catch(console.log)

app.get('/',(req,res)=> {
    res.send('bike server is running')
})

app.listen(port, (req,res)=> {
    console.log(' bike server is running on port', port);
})