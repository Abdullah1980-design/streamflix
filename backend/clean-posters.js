require("dotenv").config();
const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const collection = mongoose.connection.db.collection("movies");
  const movies = await collection.find({}).toArray();

  let fixed = 0;

  for (const movie of movies) {
    const p = String(movie.poster || "");

    const start = p.indexOf("https://");
    const separator = p.indexOf("](", start);

    if (start !== -1 && separator !== -1) {
      const url = p.substring(start, separator);

      await collection.updateOne(
        { _id: movie._id },
        { $set: { poster: url } }
      );

      console.log(`FIXED: ${movie.title}`);
      fixed++;
    }
  }

  console.log(`\nTOTAL FIXED: ${fixed}`);

  await mongoose.disconnect();
}

run().catch(err => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
