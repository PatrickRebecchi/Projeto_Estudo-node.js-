import "dotenv/config";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URL);

await client.connect();

const users = client.db().collection("User");

await users.createIndex(
  { createdAt: -1 },
  {
    name: "createdAt_desc",
    background: true,
  },
);

console.log("Índice createdAt_desc criado com sucesso");

await client.close();
