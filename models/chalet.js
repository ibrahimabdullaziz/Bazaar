const { default: mongoose, Types } = require("mongoose");

const chaletSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    location: { type: String, required: true }, // we can use GeoJSON later if we want map features.
    images: { type: [{ type: String }], required: true },
    host: { type: Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Chalet", chaletSchema);
