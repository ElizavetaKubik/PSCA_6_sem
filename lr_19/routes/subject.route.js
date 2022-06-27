const Router = require("express");
const router = new Router();
const subjectController = require("../controllers/subject.controller");

router.get("/subjects", subjectController.getSubjects);
router.post("/subject", subjectController.createSubject);
router.put("/subject", subjectController.updateSubject);
router.delete("/subject", subjectController.deleteSubject);

module.exports = router;
