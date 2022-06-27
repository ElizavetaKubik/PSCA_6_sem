const Router = require("express");
const router = new Router();
const pulpitController = require("../controllers/pulpit.controller");

router.get("/pulpits", pulpitController.getPulpits);
router.post("/pulpit", pulpitController.createPulpit);
router.put("/pulpit", pulpitController.updatePulpit);
router.delete("/pulpit", pulpitController.deletePulpit);

module.exports = router;
