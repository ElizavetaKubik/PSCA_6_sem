const sequelize = require("../config/config");
const { Repo, Commit } = require("../model/model").Models(sequelize);

class CommitController {
  static async getCommits(req, res) {
    try {
      req.ability.throwUnlessCan("read", "Commit");
      const commits = await Commit.findAll({
        include: [
          {
            model: Repo,
            as: "repo_commit",
            where: {
              id: req.params.id,
            },
          },
        ],
      });
      res.status(200).json(commits);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getCommitInfo(req, res) {
    try {
      req.ability.throwUnlessCan("read", "Commit");
      const commit = await Commit.findOne({
        where: {
          id: req.params.commitId,
        },
        include: [
          {
            model: Repo,
            as: "repo_commit",
            where: {
              id: req.params.id,
            },
          },
        ],
      });
      if (commit) res.status(200).json(commit);
      else res.status(404).send("Commit doesn't exist");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async createCommit(req, res) {
    try {
      req.ability.throwUnlessCan("create", "Commit");

      let repo = await Repo.findByPk(req.params.id).then((data) => {
        return data;
      });
      //   console.log(req.payload.id);

      //   req.ability.throwUnlessCan(
      //     "create",
      //     await Repo.findByPk(req.params.id).then((e) => {
      //       return e.authorId;
      //     })
      //   );
      //   if(req.params.id==await Repo.findByPk(req.params.id).then((e) => {
      //     //     console.log(JSON.stringify(e));
      //     //   });)

      if (repo) {
        if (repo.authorId == req.payload.id) {
          const commit = await Commit.create({
            message: req.body.message,
            repoId: req.params.id,
          });
          res.status(201).send(commit);
        } else {
          res.send(`Cannot execute "create" on "Commit"`);
        }
      } else {
        res.status(404).send("Repo doesn't exist");
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async updateCommit(req, res) {
    try {
      req.ability.throwUnlessCan("update", "Commit");

      let commit = await Commit.findAll({
        where: { id: req.params.commitId },
        include: [
          {
            model: Repo,
            as: "repo_commit",
            where: {
              id: req.params.id,
            },
          },
        ],
      }).then((data) => {
        return data;
      });

      if (commit == "") {
        res.send("This commit doesn't exist.");
      } else if (
        commit[0].repo_commit.authorId == req.payload.id ||
        req.payload.role == "admin"
      ) {
        await Commit.update(
          {
            message: req.body.message,
          },
          {
            where: {
              id: req.params.commitId,
            },
            include: [
              {
                model: Repo,
                required: true,
                where: {
                  id: req.params.id,
                },
                attributes: [],
              },
            ],
          }
        );
        res.status(200).send("Commit is updated");
      } else res.send(`Cannot execute "update" on "Commit"`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async deleteCommit(req, res) {
    try {
      req.ability.throwUnlessCan("delete", "Commit");

      let commit = await Commit.findAll({
        where: { id: req.params.commitId },
        include: [
          {
            model: Repo,
            as: "repo_commit",
            where: {
              id: req.params.id,
            },
          },
        ],
      }).then((data) => {
        return data;
      });

      if (commit == "") {
        res.status(404).send("Commit doesn't exist");
      } else {
        await Commit.destroy({
          where: {
            id: req.params.commitId,
          },
          include: [
            {
              model: Repo,
              required: true,
              where: {
                id: req.params.id,
              },
              attributes: [],
            },
          ],
        });
        res.status(200).send("Commit is deleted");
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = CommitController;
