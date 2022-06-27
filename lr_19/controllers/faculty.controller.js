const sequelize = require("../config");
const FacultyModel = require("../models//models").Models(sequelize).Faculty;

class FacultyController {
  static async getFaculty(inFaculty) {
    let faculty = await FacultyModel.findAll({ where: { faculty: inFaculty } });
    faculty = JSON.stringify(faculty);
    return faculty;
  }

  static async getFaculties(req, res) {
    let faculties = await FacultyModel.findAll();
    res.json(faculties);
  }

  static async createFaculty(req, res) {
    try {
      let faculty = await FacultyController.getFaculty(req.body.faculty);
      if (faculty == "[]") {
        FacultyModel.create({
          faculty: req.body.faculty,
          faculty_name: req.body.faculty_name,
        });
        res.send("Success.");
      } else {
        res.status(400).send("This faculty already exists.");
      }
    } catch (e) {
      res.status(400).send("Bad request");
    }
  }

  static async updateFaculty(req, res) {
    try {
      let faculty = await FacultyController.getFaculty(req.body.faculty);
      if (faculty != "[]") {
        FacultyModel.update(
          { faculty_name: req.body.faculty_name },
          { where: { faculty: req.body.faculty } }
        );
        res.send("Success.");
      } else {
        res.status(400).send("This faculty doesn't exist.");
      }
    } catch (e) {
      res.status(400).send("Bad request");
    }
  }

  static async deleteFaculty(req, res) {
    try {
      let faculty = await FacultyController.getFaculty(req.body.faculty);
      if (faculty != "[]") {
        FacultyModel.destroy({ where: { faculty: req.body.faculty } });
        res.send("Success.");
      } else {
        res.status(400).send("This faculty doesn't exist.");
      }
    } catch (e) {
      res.status(400).send("Bad request");
    }
  }
}

module.exports = FacultyController;
