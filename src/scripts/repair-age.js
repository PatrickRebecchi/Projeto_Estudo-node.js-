import "dotenv/config";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URL);

await client.connect();

const database = client.db();
const users = database.collection("User");

await users.updateMany(
  { age: { $type: "string" } },
  [{ $set: { age: { $toInt: "$age" } } }],
);

await users.updateMany(
  { age: null },
  [{ $set: { age: 0 } }],
);

await users.updateMany(
  {
    $or: [
      { createdAt: null },
      { createdAt: { $type: "string" } },
      { createdAt: { $exists: false } },
    ],
  },
  [{ $set: { createdAt: "$$NOW", updatedAt: "$$NOW" } }],
);

await users.updateMany(
  { role: null },
  [{ $set: { role: "user" } }],
);

console.log("Dados legados convertidos para o schema atual");

await client.close();
