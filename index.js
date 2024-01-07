const express = require('express');
const cors = require('cors');
const { query } = require('express');
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hkshaw4.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();
   
    const breakfast = client.db('Restaruant').collection('Breakfast');
    const luanch = client.db('Restaruant').collection('Luanch');
    const dinner = client.db('Restaruant').collection('Dinner');
    const OrderList = client.db('Restaruant').collection('OrderList');

    app.get("/getBrakFast", async (req, res) => {
      const data = breakfast.find();
      const result = await data.toArray();
      res.send(result);
    });
    app.get("/getLuanch", async (req, res) => {
      const data = luanch.find();
      const result = await data.toArray();
      res.send(result);
    });
    app.get("/getDinner", async (req, res) => {
      const data = dinner.find();
      const result = await data.toArray();
      res.send(result);
    });

// end get main data from database
// start get data from compunent for post

app.get('/getBrakFastInsert/:id', async(req,res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await breakfast.findOne(query);
  res.send(result);
})

app.get('/getLunchInsert/:id', async(req,res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await luanch.findOne(query);
  res.send(result);
})
app.get('/getDinnerInsert/:id', async(req,res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await dinner.findOne(query);
  res.send(result);
})


app.post('/postData', async(req,res) => {
  const body = req.body;
  const query = await OrderList.insertOne(body);
  res.send(query);
})

app.get("/getPostData", async (req, res) => {
  try {
    const { email } = req.query;
    const booking = await OrderList.find({ email }).toArray();
    res.send(booking);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete("/deleteData/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await OrderList.deleteOne(query);
  res.send(result);
});




  } 
  finally {

    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log('Example app listening on port', port)
});