if (process.env.NODE_ENV != "production") {
    require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
}

const mongoose= require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/Nivasa";

main()
.then(async ()=>{
    console.log("connected to database ");
    await initDB();
})
.catch(err=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}


const initDB = async() =>{
    const rohan = await User.findOne({
        username: { $regex: /^rohan\s*$/i },
    });

    if (!rohan) {
        throw new Error('User "rohan" not found. Create that user first.');
    }

    const listingsWithOwner = initData.data.map((obj) => ({
        ...obj,
        owner: rohan._id,
    }));

    await Listing.deleteMany({});
    await Listing.insertMany(listingsWithOwner);
    console.log("data was initialized");

};
