const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const ProductSchema = new Schema({
    title: { type: String },
    description: { type: String },
    images: [ImageSchema],
    certificate: { type: String },
    price: { type: Number },
    location: { type: String },
    endTime: { type: String },
    category: { type: String, enum: ["collectible", "antique", "painting", "sculpture"] },
    seller: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Product', ProductSchema);