const { Schema, model } = require("mongoose");

const schema = new Schema(
    {
        name: { type: String, required: true },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = model("Brand", schema);
