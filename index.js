const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('dotenv');
const { json, urlencoded } = require('express');

config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hkshaw4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function closeMongoDBConnection() {
  try {
    await client.close();
    console.log('Closed MongoDB connection');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/getBrakFast', async (req, res) => {
  const result = await client.db('Restaruant').collection('Breakfast').find().toArray();
  res.send(result);
});

app.get('/getLuanch', async (req, res) => {
  const result = await client.db('Restaruant').collection('Luanch').find().toArray();
  res.send(result);
});

app.get('/getDinner', async (req, res) => {
  const result = await client.db('Restaruant').collection('Dinner').find().toArray();
  res.send(result);
});

app.get('/getBrakFastInsert/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await client.db('Restaruant').collection('Breakfast').findOne(query);
  res.send(result);
});

app.get('/getLunchInsert/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await client.db('Restaruant').collection('Luanch').findOne(query);
  res.send(result);
});

app.get('/getDinnerInsert/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await client.db('Restaruant').collection('Dinner').findOne(query);
  res.send(result);
});

app.post('/postData', async (req, res) => {
  const body = req.body;
  const query = await client.db('Restaruant').collection('OrderList').insertOne(body);
  res.send(query);
});

app.get('/getPostData', async (req, res) => {
  try {
    const { email } = req.query;
    const booking = await client.db('Restaruant').collection('OrderList').find({ email }).toArray();
    res.send(booking);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/deleteData/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await client.db('Restaruant').collection('OrderList').deleteOne(query);
  res.send(result);
});

// Start the server
async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

// Gracefully handle termination signals and close MongoDB connection
process.on('SIGINT', async () => {
  await closeMongoDBConnection();
  process.exit();
});

startServer();
