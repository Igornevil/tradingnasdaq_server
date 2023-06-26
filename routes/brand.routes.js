const express = require("express");
const Brand = require("../models/Brand");
const Category = require("../models/Category");

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
    const { cat } = req.query;

    try {
        if (cat) {
            const categoryId = await Category.findOne({ name: cat });
            const list = await Brand.find({ category: categoryId._id });
            return res.status(200).send(list);
        }

        const list = await Brand.find();
        res.status(200).send(list);
    } catch (e) {
        res.status(500).json({
            message: "На сервере произошла ошибка. Попробуйте позже"
        });
    }
});

router.post("/", async (req, res) => {
    const { name, category } = req.body;

    const isFound = await Brand.findOne({ name });
    if (isFound && isFound.category == category) {
        return res.status(400).send({
            error: {
                message: "BRAND_EXISTS",
                code: 400
            }
        });
    }
    const data = await Brand.create({ name, category });
    return res.status(200).send(data);
});

module.exports = router;
