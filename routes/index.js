const express = require("express");
const router = express.Router({ mergeParams: true });

// /api/auth
// router.use("/auth", require("./auth.routes"));
// router.use("/user", require("./user.routes"));
router.use("/bot", require("./product.routes"));
router.use("/brand", require("./brand.routes"));
// router.use("/category", require("./category.routes"));
// router.use("/helpers", require("../111"));

module.exports = router;
