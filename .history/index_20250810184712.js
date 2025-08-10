require('dotenv').config(); 

const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log("MongoDB URI from .env:", uri);
if (!uri) {
  console.error(" MONGODB_URI is not defined. Check your .env file.");
  process.exit(1);
}
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(" Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });