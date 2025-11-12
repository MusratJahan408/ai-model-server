const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.two3kqb.mongodb.net/?appName=Cluster0`;

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
    await client.connect();

    const db = client.db("model-db");
    const modelCollection = db.collection("models");

    app.get("/models", async (req, res) => {
      const result = await modelCollection.find().toArray();
      res.send(result);
    });

    app.get("/models/:id", async (req, res) => {
      const { id } = req.params;
      const result = await modelCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.put("/models/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const update = {
        $set: data,
      };
      const result = await modelCollection.updateOne(filter, update);
      res.send(result);
    });

    app.delete("/models/:id", async (req, res) => {
      const { id } = req.params;
      const result = await modelCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/models", async (req, res) => {
      const data = req.body;
      const result = await modelCollection.insertOne(data);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
