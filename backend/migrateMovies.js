const mongoose = require("mongoose");

const Movie = require("./models/Movie");

const LOCAL_URI = "mongodb://127.0.0.1:27017/streamflix";

// ⚠️ Yahan apni Atlas MONGO_URI paste karni hai
const ATLAS_URI = process.env.MONGO_URI;

async function migrate() {
  try {
    console.log("Connecting to local MongoDB...");
    const localConnection = await mongoose.createConnection(LOCAL_URI).asPromise();

    const LocalMovie = localConnection.model("Movie", Movie.schema);

    const movies = await LocalMovie.find({});

    console.log(`Found ${movies.length} movies locally.`);

    if (movies.length === 0) {
      console.log("No movies found.");
      process.exit(0);
    }

    console.log("Connecting to Atlas...");

    const atlasConnection = await mongoose.createConnection(ATLAS_URI).asPromise();

    const AtlasMovie = atlasConnection.model("Movie", Movie.schema);

    await AtlasMovie.deleteMany({});

    const plainMovies = movies.map(movie => movie.toObject());

    await AtlasMovie.insertMany(plainMovies);

    console.log(`✅ Successfully migrated ${plainMovies.length} movies to Atlas.`);

    await localConnection.close();
    await atlasConnection.close();

    process.exit(0);

  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error);
    process.exit(1);
  }
}

migrate();
