const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzh9xhl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });

 async function  run(){
    try{
        const categoryCollection = client.db("bikeResale").collection("category")
        const productsCollection = client.db("bikeResale").collection("products")
        const ordersCollection = client.db("bikeResale").collection("orders")
        const usersCollection = client.db("bikeResale").collection("users")

        app.get('/category', async(req,res)=>{
            const query = {}
            const result = await categoryCollection.find(query).toArray()
            res.send(result);
        })

        app.post('/products',async(req,res)=>{
            const data = req.body;
            const products = await productsCollection.insertOne(data)
            res.send(products)
        })

        app.get('/products', async(req,res)=>{
            const email = req.query.email
            const query = {email: email}
            const result = await productsCollection.find(query).toArray()
            res.send(result);
        })
        app.get('/products/:brand', async(req,res)=>{
            const brand = req.params.brand
            const query = {brand: brand}
            const result = await productsCollection.find(query).toArray()
            res.send(result);
        }) 
            //if admin
        app.get('/users/admin/:email', async(req,res)=> {
            const email = req.params.email;
            const query = {email:email}
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin'})
        })
            //if seller
        app.get('/users/seller/:email', async(req,res)=> {
            const email = req.params.email;
            const query = {email:email}
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.isSeller === true, isVerified: user?.status=== 'verified'})
        })
            //find all seller
            app.get('/users/allseller', async(req,res)=> {
                const query = {isSeller:true}
                const seller = await usersCollection.find(query).toArray()
                res.send(seller)
            })    
            //find all seller
            app.get('/users/allbuyer', async(req,res)=> {
                const query = {isSeller:false}
                const buyer = await usersCollection.find(query).toArray()
                res.send(buyer)
            })  
            
            //delete buyer
            app.delete('/users/:id',async(req,res)=>{
                const id = req.params.id
                const query = {_id:ObjectId(id)}
                const result = await usersCollection.deleteOne(query)
                res.send(result)
            })
                //if buyer
        app.get('/users/buyer/:email', async(req,res)=> {
            const email = req.params.email;
            const query = {email:email}
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.isSeller === false})
        })


        app.post('/orders',async(req,res)=>{
            const data = req.body;
            const orders = await ordersCollection.insertOne(data)
            res.send(orders)
        })

        app.get('/orders', async(req,res)=> {
            const email = req.query.email;
            const query = {email:email}
            const orders = await ordersCollection.find(query).toArray();
            res.send(orders)
        })

        app.delete('/orders/:id', async(req,res)=> {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const deletorders = await ordersCollection.deleteOne(query);
            res.send(deletorders)
        })

        app.post('/users',async(req,res)=>{
            const data = req.body;
            const users = await usersCollection.insertOne(data)
            res.send(users)
        })
            //verify seller
            app.put('/users/verify/:id',async(req, res)=>{
                const id = req.params.id;
                const filter = {_id: ObjectId(id)}
                const options = {upsert: true}
                const updateDoc = {
                    $set: {
                        status: 'verified'
                    }
                }
                const result  = await usersCollection.updateOne(filter,updateDoc, options)
                res.send(result)
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