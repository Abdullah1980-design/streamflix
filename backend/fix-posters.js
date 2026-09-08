require("dotenv").config();
const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const db = mongoose.connection.db;
  const movies = db.collection("movies");

  const docs = await movies.find({
    poster: { $regex: /^\[https?:\/\// }
  }).toArray();

  console.log(`Found ${docs.length} malformed poster URLs.`);

  for (const movie of docs) {
    const match = movie.poster.match(/\((https?:\/\/[^)]+)\)/);

    if (match) {
      await movies.updateOne(
        { _id: movie._id },
        { $set: { poster: match[1] } }
      );

      console.log(`Fixed: ${movie.title}`);
    }
  }

  await mongoose.disconnect();
  console.log("DONE ✅");
}

run().catch(async (err) => {
  console.error("ERROR:", err.message);
  await mongoose.disconnect();
});
