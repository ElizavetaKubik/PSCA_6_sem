const sequelize = require("../config/config");
const { Repo } = require("../model/model").Models(sequelize);
const path = require("path");

class RepoController {
  static async showRepos(req, res) {
    try {
      const repos = await Repo.findAll();
      res.status(200).json(repos);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async showRepo(req, res) {
    try {
      req.ability.throwUnlessCan("read", "Repo");
      const repo = await Repo.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (repo) {
        res.status(200).json(repo);
      } else {
        res.status(404).send("Repo doesn't exist");
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async addRepo(req, res) {
    try {
      req.ability.throwUnlessCan("create", "Repo");
      const repo = await Repo.create({
        name: req.body.name,
        authorId: req.payload.id,
      });
      res.status(201).json(repo);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async updateRepo(req, res) {
    try {
      req.ability.throwUnlessCan("update", "Repo");

      let repo = await Repo.findByPk(req.params.id).then((data) => {
        return data;
      });

      if (repo) {
        if (repo.authorId == req.payload.id || req.payload.role === "admin") {
          await Repo.update(
            {
              name: req.body.name,
            },
            {
              where: {
                id: req.params.id,
              },
            }
          );
          res.status(201).send("Repo is updated");
        } else {
          res.send(`Cannot execute "update" on "Repo"`);
        }
      } else {
        res.status(404).send("Repo doesn't exist");
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async deleteRepo(req, res) {
    try {
      req.ability.throwUnlessCan("delete", "Repo");

      let repo = await Repo.findByPk(req.params.id).then((data) => {
        return data;
      });

      if (repo != null) {
        await Repo.destroy({
          where: {
            id: req.params.id,
          },
        });
        res.status(201).send("Repo is deleted");
      } else {
        res.status(404).send("Repo doesn't exist");
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = RepoController;
