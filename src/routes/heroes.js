const express = require("express");
const router = express.Router();
const heroesController = require("../controllers/heroes");
const checkHahowAuth = require("../middlewares/check-hahow-auth");

router.get("/", checkHahowAuth, heroesController.getHeroes);

router.get("/:heroId", checkHahowAuth, heroesController.getHero);

module.exports = router;    