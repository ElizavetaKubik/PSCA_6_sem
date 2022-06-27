const sequelize = require("../config");
const SubjectModel = require("../models//models").Models(sequelize).Subject;

const PulpitController = require("../controllers/pulpit.controller");

class SubjectController {
  static async getSubject(inSubject) {
    let subject = await SubjectModel.findAll({ where: { subject: inSubject } });
    subject = JSON.stringify(subject);
    return subject;
  }

  static async getSubjects(req, res) {
    let data = await SubjectModel.findAll();
    res.json(data);
  }

  static async createSubject(req, res) {
    try {
      let pulpit = await PulpitController.getPulpit(req.body.pulpit);
      if (pulpit != "[]") {
        let subject = await SubjectController.getSubject(req.body.subject);
        if (subject == "[]") {
          SubjectModel.create({
            subject: req.body.subject,
            subject_name: req.body.subject_name,
            pulpit: req.body.pulpit,
          });
          res.send("Success.");
        } else {
          res.status(400).send("This subject already exists.");
        }
      } else {
        res.status(400).send("This pulpit doesn't exist.");
      }
    } catch (e) {
      res.status(400).send("Bad request");
    }
  }

  static async updateSubject(req, res) {
    try {
      let subject = await SubjectController.getSubject(req.body.subject);
      if (subject != "[]") {
        SubjectModel.update(
          { subject_name: req.body.subject_name },
          { where: { subject: req.body.subject } }
        );
        res.send("Success.");
      } else {
        res.status(400).send("This subject doesn't exist.");
      }
    } catch (e) {
      res.status(400).send("Bad request");
    }
  }

  static async deleteSubject(req, res) {
    try {
      let subject = await SubjectController.getSubject(req.body.subject);
      if (subject != "[]") {
        SubjectModel.destroy({ where: { subject: req.body.subject } });
        res.send("Success.");
      } else {
        res.status(400).send("This subject doesn't exist.");
      }
    } catch (e) {
      res.status(400).send("Bad request");
    }
  }
}

module.exports = SubjectController;
