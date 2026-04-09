const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")
const schema = new mongoose.Schema({
    name: String,
    category: String,
    position: Number,
    status: String,
    avatar: String,
    priceAdult: Number,
    priceChildren: Number,
    priceBaby: Number,
    priceNewAdult: Number,
    priceNewChildren: Number,
    priceNewBaby: Number,
    stockAdult: Number,
    stockChildren: Number,
    stockBaby: Number,
    locations: Array,
    time: String,
    vehicle: String,
    departureDate: Date,
    information: String,
    schedules: Array,
    images: Array,
    updatedBy: String,
    createdBy: String,
    slug: {
        type: String,
        slug: "name", // theo truong name
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: String,
    deletedAt: Date,
    description: String,
}, {
    timestamps: true // TU DONG sinh ra truong creatAt va updateAt
})
const Tour = mongoose.model("Tour",schema,"tours")
module.exports = Tour
