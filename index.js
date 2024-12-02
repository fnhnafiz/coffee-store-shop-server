const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Project Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.udh1k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // client.connect();

    // create a folder and the name of folder "coffeeDB" and file name "coffee"
    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    // Create a Database for User
    const userCollection = client.db("coffeeDB").collection("users");

    // show and convert object with an toArray with Read oparators
    app.get("/details", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Post cofee details in client side

    app.post("/details", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);

      // when a user order the coffe and we set the data in database
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    //updated coffee
    app.put("/details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          chef: updatedCoffee.chef,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo,
        },
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    });

    // show details a coffee using params id with details oparators
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // Delete Coffee cards from server side with params

    app.delete("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Create Register and Store User api in Database
    // Create Register and Store User api in Database
    // Create Register and Store User api in Database

    // show the user data or access to the user data;

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // users Register data save to the DB in the first time;
    app.post("/users", async (req, res) => {
      const registerUser = req.body;

      const result = await userCollection.insertOne(registerUser);
      res.send(result);
    });

    // speciphic user data update with patch and using email

    app.patch("/users/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email };
      const updatedUser = {
        $set: {
          lastSignInTime: req?.body?.lastSignInTime,
        },
      };
      const result = await userCollection.updateOne(filter, updatedUser);
      res.send(result);
    });

    // User Delete from client side and database
    // User Delete from client side and database
    // User Delete from client side and database
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("Coffee Server is Running Now");
});

app.listen(port, () => {
  console.log(`This Coffee server Running PORT NUMBER is || ${port}`);
});
