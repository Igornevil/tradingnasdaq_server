const { Schema, model } = require("mongoose");

const schema = new Schema(
    {
        name: { type: String },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
        description: { type: String },
        image: { type: String },
        model: { type: String, required: true },
        price: { type: String, required: true },
        price_old: { type: String, default: "" }
    },
    {
        timestamps: true
    }
);

module.exports = model("Product", schema);
