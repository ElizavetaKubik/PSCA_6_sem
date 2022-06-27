const sequelize = require("../config");
const PulpitModel = require("../models//models").Models(sequelize).Pulpit;

const FacultyController = require("../controllers/faculty.controller");

class PulpitController {
  static async getPulpit(inPulpit) {
    let pulpit = await PulpitModel.findAll({ where: { pulpit: inPulpit } });
    pulpit = JSON.stringify(pulpit);
    return pulpit;
  }

  static async getPulpits(req, res) {
    let pulpits = await PulpitModel.findAll();
    res.json(pulpits);
  }

  static async createPulpit(req, res) {
    try {
      let faculty = await FacultyController.getFaculty(req.body.faculty);
      if (faculty != "[]") {
        let pulpit = await PulpitController.getPulpit(req.body.pulpit);
        if (pulpit == "[]") {
          PulpitModel.create({
            pulpit: req.body.pulpit,
            pulpit_name: req.body.pulpit_name,
            faculty: req.body.faculty,
          });
          res.send("Success.");
        } else {
          res.status(400).send("This pulpit already exists.");
        }
      } else {
        res.status(400).send("This faculty doesn't exist.");
      }
    } catch (e) {
      res.status(400).send("Bad request");
    }
  }

  static async updatePulpit(req, res) {
    try {
      let pulpit = await PulpitController.getPulpit(req.body.pulpit);
      if (pulpit != "[]") {
        PulpitModel.update(
          { pulpit_name: req.body.pulpit_name },
          { where: { pulpit: req.body.pulpit } }
        );
        res.send("Success.");
      } else {
        res.status(400).send("This pulpit doesn't exist.");
      }
    } catch (e) {
      res.status(400).send("Bad request");
    }
  }

  static async deletePulpit(req, res) {
    try {
      let pulpit = await PulpitController.getPulpit(req.body.pulpit);
      if (pulpit != "[]") {
        PulpitModel.destroy({ where: { pulpit: req.body.pulpit } });
        res.send("Success.");
      } else {
        res.status(400).send("This pulpit doesn't exist.");
      }
    } catch (e) {
      res.status(400).send("Bad request");
    }
  }
}

module.exports = PulpitController;
