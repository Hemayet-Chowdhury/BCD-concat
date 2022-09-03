import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { MongoClient } from "mongodb";
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("myNewDB");
    const orders = database.collection("orders");
    // create a document to insert
    const doc = {
      title: "Record of a Shriveled Datum",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    };
    const result = await orders.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
