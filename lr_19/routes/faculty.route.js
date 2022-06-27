const Router = require("express");
const router = new Router();
const facultyController = require("../controllers/faculty.controller");

router.get("/faculties", facultyController.getFaculties);
router.post("/faculty", facultyController.createFaculty);
router.put("/faculty", facultyController.updateFaculty);
router.delete("/faculty", facultyController.deleteFaculty);

module.exports = router;
