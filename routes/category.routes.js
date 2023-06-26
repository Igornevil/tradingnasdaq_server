const express = require("express");
const Category = require("../models/Category");
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
    try {
        const list = await Category.find();
        res.status(200).send(list);
    } catch (e) {
        res.status(500).json({
            message: "На сервере произошла ошибка. Попробуйте позже"
        });
    }
});
router.post("/", async (req, res) => {
    const { name } = req.body;

    const isFound = await Category.findOne({ name });
    if (isFound) {
        return res.status(400).send({
            error: {
                message: "CATEGORY_EXISTS",
                code: 400
            }
        });
    }
    const data = await Category.create({ name });
    return res.status(200).send(data);
});
module.exports = router;
