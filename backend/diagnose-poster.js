require("dotenv").config();
const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const c = mongoose.connection.db.collection("movies");
  const m = await c.findOne({ title: "The Dark Knight" });

  console.log("RAW:");
  console.log(JSON.stringify(m.poster));

  console.log("\nLENGTH:", m.poster.length);

  console.log("\nCHARACTERS:");
  for (let i = 0; i < m.poster.length; i++) {
    console.log(i, JSON.stringify(m.poster[i]), m.poster.charCodeAt(i));
  }

  await mongoose.disconnect();
}

run().catch(console.error);
