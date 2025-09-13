const mongoose = require("mongoose");
const dotenv = require("dotenv");
const RoundOne = require("./roundOne.model");

dotenv.config();

const bids = [
  {
    item_no: 1,
    items: [
      { itemName: "Technology", quantity: 6 },
      { itemName: "Property", quantity: 5 }
    ],
    base_price: 9500,
    image_path: "/images/bid1.png"
  },
  {
    item_no: 2,
    items: [
      { itemName: "Technology", quantity: 7 }
    ],
    base_price: 9000,
    image_path: "/images/bid2.png"
  },
  {
    item_no: 3,
    items: [
      { itemName: "Property", quantity: 3 },
      { itemName: "Technology", quantity: 6 }
    ],
    base_price: 8000,
    image_path: "/images/bid3.png"
  },
  {
    item_no: 4,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Technology", quantity: 4 }
    ],
    base_price: 8000,
    image_path: "/images/bid4.png"
  },
  {
    item_no: 5,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Technology", quantity: 5 }
    ],
    base_price: 8000,
    image_path: "/images/bid5.png"
  },
  {
    item_no: 6,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Technology", quantity: 4 },
      { itemName: "Electricity Supply", quantity: 4 }
    ],
    base_price: 8000,
    image_path: "/images/bid6.png"
  },
  {
    item_no: 7,
    items: [
      { itemName: "Technology", quantity: 4 },
      { itemName: "Property", quantity: 5 }
    ],
    base_price: 7500,
    image_path: "/images/bid7.png"
  },
  {
    item_no: 8,
    items: [
      { itemName: "Technology", quantity: 6 },
      { itemName: "Skilled Labour", quantity: 3 }
    ],
    base_price: 7500,
    image_path: "/images/bid8.png"
  },
  {
    item_no: 9,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Machinery & Tools", quantity: 6 }
    ],
    base_price: 7500,
    image_path: "/images/bid9.png"
  },
  {
    item_no: 10,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Machinery & Tools", quantity: 5 },
      { itemName: "Electricity Supply", quantity: 4 }
    ],
    base_price: 7500,
    image_path: "/images/bid10.png"
  },
  {
    item_no: 11,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Technology", quantity: 4 },
      { itemName: "Machinery & Tools", quantity: 4 }
    ],
    base_price: 7500,
    image_path: "/images/bid11.png"
  },
  {
    item_no: 12,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Technology", quantity: 4 }
    ],
    base_price: 7000,
    image_path: "/images/bid12.png"
  },
  {
    item_no: 13,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Office Space", quantity: 4 },
      { itemName: "Technology", quantity: 4 }
    ],
    base_price: 7000,
    image_path: "/images/bid13.png"
  },
  {
    item_no: 14,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Construction Material", quantity: 4 },
      { itemName: "Technology", quantity: 3 }
    ],
    base_price: 7000,
    image_path: "/images/bid14.png"
  },
  {
    item_no: 15,
    items: [
      { itemName: "Office Space", quantity: 4 },
      { itemName: "Technology", quantity: 6 }
    ],
    base_price: 7000,
    image_path: "/images/bid15.png"
  },
  {
    item_no: 16,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Office Space", quantity: 4 },
      { itemName: "Technology", quantity: 3 }
    ],
    base_price: 7000,
    image_path: "/images/bid16.png"
  },
  {
    item_no: 17,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Transportation", quantity: 4 },
      { itemName: "Technology", quantity: 3 }
    ],
    base_price: 7000,
    image_path: "/images/bid17.png"
  },
  {
    item_no: 18,
    items: [
      { itemName: "Property", quantity: 3 },
      { itemName: "Technology", quantity: 5 },
      { itemName: "Utilities", quantity: 4 }
    ],
    base_price: 7000,
    image_path: "/images/bid18.png"
  },
  {
    item_no: 19,
    items: [
      { itemName: "Electricity Supply", quantity: 6 },
      { itemName: "Technology", quantity: 4 }
    ],
    base_price: 7000,
    image_path: "/images/bid19.png"
  },
  {
    item_no: 20,
    items: [
      { itemName: "Machinery & Tools", quantity: 4 },
      { itemName: "Technology", quantity: 5 },
      { itemName: "Skilled Labour", quantity: 3 }
    ],
    base_price: 7000,
    image_path: "/images/bid20.png"
  },
  {
    item_no: 21,
    items: [
      { itemName: "Technology", quantity: 6 }
    ],
    base_price: 7000,
    image_path: "/images/bid21.png"
  },
  {
    item_no: 22,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Skilled Labour", quantity: 4 },
      { itemName: "Technology", quantity: 4 }
    ],
    base_price: 7500,
    image_path: "/images/bid22.png"
  },
  {
    item_no: 23,
    items: [
      { itemName: "Technology", quantity: 3 },
      { itemName: "Property", quantity: 5 }
    ],
    base_price: 6500,
    image_path: "/images/bid23.png"
  },
  {
    item_no: 24,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Office Space", quantity: 4 }
    ],
    base_price: 6500,
    image_path: "/images/bid24.png"
  },
  {
    item_no: 25,
    items: [
      { itemName: "Property", quantity: 3 },
      { itemName: "Office Space", quantity: 4 },
      { itemName: "Technology", quantity: 4 }
    ],
    base_price: 6500,
    image_path: "/images/bid25.png"
  },
  {
    item_no: 26,
    items: [
      { itemName: "Technology", quantity: 4 },
      { itemName: "Office Space", quantity: 4 }
    ],
    base_price: 6500,
    image_path: "/images/bid26.png"
  },
  {
    item_no: 27,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Technology", quantity: 3 },
      { itemName: "Utilities", quantity: 4 }
    ],
    base_price: 6500,
    image_path: "/images/bid27.png"
  },
  {
    item_no: 28,
    items: [
      { itemName: "Electricity Supply", quantity: 6 },
      { itemName: "Technology", quantity: 3 }
    ],
    base_price: 6500,
    image_path: "/images/bid28.png"
  },
  {
    item_no: 29,
    items: [
      { itemName: "Office Space", quantity: 4 },
      { itemName: "Machinery & Tools", quantity: 6 }
    ],
    base_price: 6500,
    image_path: "/images/bid29.png"
  },
  {
    item_no: 30,
    items: [
      { itemName: "Property", quantity: 3 },
      { itemName: "Technology", quantity: 4 },
      { itemName: "Electricity Supply", quantity: 5 }
    ],
    base_price: 6500,
    image_path: "/images/bid30.png"
  },
  {
    item_no: 31,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Office Space", quantity: 4 },
      { itemName: "Electricity Supply", quantity: 4 }
    ],
    base_price: 6500,
    image_path: "/images/bid31.png"
  },
  {
    item_no: 32,
    items: [
      { itemName: "Property", quantity: 6 },
      { itemName: "Skilled Labour", quantity: 5 }
    ],
    base_price: 6500,
    image_path: "/images/bid32.png"
  },
  {
    item_no: 33,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Technology", quantity: 4 }
    ],
    base_price: 6000,
    image_path: "/images/bid33.png"
  },
  {
    item_no: 34,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Office Space", quantity: 5 }
    ],
    base_price: 6000,
    image_path: "/images/bid34.png"
  },
  {
    item_no: 35,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Electricity Supply", quantity: 4 }
    ],
    base_price: 6000,
    image_path: "/images/bid35.png"
  },
  {
    item_no: 36,
    items: [
      { itemName: "Machinery & Tools", quantity: 4 },
      { itemName: "Technology", quantity: 4 }
    ],
    base_price: 6000,
    image_path: "/images/bid36.png"
  },
  {
    item_no: 37,
    items: [
      { itemName: "Machinery & Tools", quantity: 6 },
      { itemName: "Technology", quantity: 3 }
    ],
    base_price: 6000,
    image_path: "/images/bid37.png"
  },
  {
    item_no: 38,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Skilled Labour", quantity: 6 }
    ],
    base_price: 6000,
    image_path: "/images/bid38.png"
  },
  {
    item_no: 39,
    items: [
      { itemName: "Technology", quantity: 4 },
      { itemName: "Machinery & Tools", quantity: 4 },
      { itemName: "Electricity Supply", quantity: 3 }
    ],
    base_price: 6000,
    image_path: "/images/bid39.png"
  },
  {
    item_no: 40,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Construction Material", quantity: 5 },
      { itemName: "Skilled Labour", quantity: 3 }
    ],
    base_price: 6000,
    image_path: "/images/bid40.png"
  },
    {
    item_no: 41,
    items: [
      { itemName: "Property", quantity: 6 }
    ],
    base_price: 6000,
    image_path: "/images/bid41.png"
  },
  {
    item_no: 42,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Skilled Labour", quantity: 6 },
      { itemName: "Utilities", quantity: 4 }
    ],
    base_price: 6000,
    image_path: "/images/bid42.png"
  },
  {
    item_no: 43,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Construction Material", quantity: 5 },
      { itemName: "Machinery & Tools", quantity: 4 }
    ],
    base_price: 6000,
    image_path: "/images/bid43.png"
  },
  {
    item_no: 44,
    items: [
      { itemName: "Technology", quantity: 4 },
      { itemName: "Transportation", quantity: 5 }
    ],
    base_price: 6000,
    image_path: "/images/bid44.png"
  },
  {
    item_no: 45,
    items: [
      { itemName: "Technology", quantity: 5 }
    ],
    base_price: 5500,
    image_path: "/images/bid45.png"
  },
  {
    item_no: 46,
    items: [
      { itemName: "Machinery & Tools", quantity: 5 },
      { itemName: "Skilled Labour", quantity: 4 }
    ],
    base_price: 5500,
    image_path: "/images/bid46.png"
  },
  {
    item_no: 47,
    items: [
      { itemName: "Technology", quantity: 4 },
      { itemName: "Skilled Labour", quantity: 5 }
    ],
    base_price: 5500,
    image_path: "/images/bid47.png"
  },
  {
    item_no: 48,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Transportation", quantity: 3 }
    ],
    base_price: 5500,
    image_path: "/images/bid48.png"
  },
  {
    item_no: 49,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Construction Material", quantity: 4 }
    ],
    base_price: 5500,
    image_path: "/images/bid49.png"
  },
  {
    item_no: 50,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Skilled Labour", quantity: 4 },
      { itemName: "Utilities", quantity: 4 }
    ],
    base_price: 5500,
    image_path: "/images/bid50.png"
  },
  {
    item_no: 51,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Machinery & Tools", quantity: 4 },
      { itemName: "Electricity Supply", quantity: 4 }
    ],
    base_price: 5500,
    image_path: "/images/bid51.png"
  },
    {
    item_no: 52,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Utilities", quantity: 5 }
    ],
    base_price: 5500,
    image_path: "/images/bid52.png"
  },
  {
    item_no: 53,
    items: [
      { itemName: "Machinery & Tools", quantity: 6 },
      { itemName: "Skilled Labour", quantity: 4 }
    ],
    base_price: 5500,
    image_path: "/images/bid53.png"
  },
  {
    item_no: 54,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Electricity Supply", quantity: 6 }
    ],
    base_price: 5500,
    image_path: "/images/bid54.png"
  },
  {
    item_no: 55,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Transportation", quantity: 4 }
    ],
    base_price: 5500,
    image_path: "/images/bid55.png"
  },
  {
    item_no: 56,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Skilled Labour", quantity: 4 },
      { itemName: "Machinery & Tools", quantity: 4 }
    ],
    base_price: 5500,
    image_path: "/images/bid56.png"
  },
  {
    item_no: 57,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Transportation", quantity: 4 },
      { itemName: "Machinery & Tools", quantity: 4 }
    ],
    base_price: 5500,
    image_path: "/images/bid57.png"
  },
  {
    item_no: 58,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Electricity Supply", quantity: 5 },
      { itemName: "Skilled Labour", quantity: 4 }
    ],
    base_price: 5500,
    image_path: "/images/bid58.png"
  },
  {
    item_no: 59,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Office Space", quantity: 4 },
      { itemName: "Skilled Labour", quantity: 5 }
    ],
    base_price: 5500,
    image_path: "/images/bid59.png"
  },
  {
    item_no: 60,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Electricity Supply", quantity: 4 },
      { itemName: "Machinery & Tools", quantity: 4 }
    ],
    base_price: 5500,
    image_path: "/images/bid60.png"
  },
  {
    item_no: 61,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Skilled Labour", quantity: 5 }
    ],
    base_price: 5000,
    image_path: "/images/bid61.png"
  },
  {
    item_no: 62,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Construction Material", quantity: 4 },
      { itemName: "Skilled Labour", quantity: 3 }
    ],
    base_price: 5000,
    image_path: "/images/bid62.png"
  },
    {
    item_no: 63,
    items: [
      { itemName: "Property", quantity: 3 },
      { itemName: "Machinery & Tools", quantity: 5 },
      { itemName: "Utilities", quantity: 4 }
    ],
    base_price: 5000,
    image_path: "/images/bid63.png"
  },
  {
    item_no: 64,
    items: [
      { itemName: "Machinery & Tools", quantity: 5 },
      { itemName: "Construction Material", quantity: 5 }
    ],
    base_price: 5000,
    image_path: "/images/bid64.png"
  },
  {
    item_no: 65,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Transportation", quantity: 5 }
    ],
    base_price: 5000,
    image_path: "/images/bid65.png"
  },
  {
    item_no: 66,
    items: [
      { itemName: "Electricity Supply", quantity: 6 },
      { itemName: "Skilled Labour", quantity: 4 }
    ],
    base_price: 5000,
    image_path: "/images/bid66.png"
  },
  {
    item_no: 67,
    items: [
      { itemName: "Skilled Labour", quantity: 7 },
      { itemName: "Office Space", quantity: 4 }
    ],
    base_price: 5000,
    image_path: "/images/bid67.png"
  },
  {
    item_no: 68,
    items: [
      { itemName: "Office Space", quantity: 6 },
      { itemName: "Skilled Labour", quantity: 4 }
    ],
    base_price: 5000,
    image_path: "/images/bid68.png"
  },
  {
    item_no: 69,
    items: [
      { itemName: "Machinery & Tools", quantity: 6 },
      { itemName: "Utilities", quantity: 4 }
    ],
    base_price: 5000,
    image_path: "/images/bid69.png"
  },
  {
    item_no: 70,
    items: [
      { itemName: "Property", quantity: 3 },
      { itemName: "Skilled Labour", quantity: 4 },
      { itemName: "Machinery & Tools", quantity: 5 }
    ],
    base_price: 5000,
    image_path: "/images/bid70.png"
  },
  {
    item_no: 71,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Utilities", quantity: 5 },
      { itemName: "Skilled Labour", quantity: 4 }
    ],
    base_price: 5000,
    image_path: "/images/bid71.png"
  },
  {
    item_no: 72,
    items: [
      { itemName: "Property", quantity: 3 },
      { itemName: "Skilled Labour", quantity: 7 },
      { itemName: "Utilities", quantity: 5 }
    ],
    base_price: 5000,
    image_path: "/images/bid72.png"
  },
  {
    item_no: 73,
    items: [
      { itemName: "Property", quantity: 4 },
      { itemName: "Skilled Labour", quantity: 5 },
      { itemName: "Utilities", quantity: 5 }
    ],
    base_price: 5000,
    image_path: "/images/bid73.png"
  },
  {
    item_no: 74,
    items: [
      { itemName: "Property", quantity: 5 },
      { itemName: "Skilled Labour", quantity: 4 },
      { itemName: "Technology", quantity: 4 }
    ],
    base_price: 7500,
    image_path: "/images/bid74.png"
  },
  {
    item_no: 75,
    items: [
      { itemName: "Technology", quantity: 4 },
      { itemName: "Machinery & Tools", quantity: 4 },
      { itemName: "Electricity Supply", quantity: 3 }
    ],
    base_price: 6000,
    image_path: "/images/bid75.png"
  }

];

async function seedRoundOne() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ MongoDB Connected");

    // Clear old data
    await RoundOne.deleteMany({});
    console.log("🗑️ Cleared old RoundOne data");

    // Insert new data
    await RoundOne.create({
      ID: 1,
      item_list: bids,
      item_list_bidded: []
    });

    console.log("🎉 Round One data seeded successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding Round One:", err);
    mongoose.connection.close();
  }
}

seedRoundOne();
