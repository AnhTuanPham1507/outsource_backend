const { Router } = require("express");
const router = Router({ mergeParams: true });

const { router: brandRouter } = require("./BrandRoute");


router.use("/demo", brandRouter);

module.exports = router;