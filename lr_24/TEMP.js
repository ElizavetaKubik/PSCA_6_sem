app.get("/api/user", async (req, res) => {
  try {
    req.ability.throwUnlessCan("manage", "all");
    const users = await UsersCASL.findAll({
      attributes: ["id", "username", "email", "role"],
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    req.ability.throwUnlessCan(
      "read",
      new UsersCASL({ id: Number(req.params.id) })
    );
    const user = await UsersCASL.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "username", "email", "role"],
    });
    if (user) res.status(200).json(user);
    else res.status(404).send("User is not found");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/repos", async (req, res) => {
  try {
    req.ability.throwUnlessCan("manage", "all");
    const repos = await Repos.findAll();
    res.status(200).json(repos);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/repos/:id", async (req, res) => {
  try {
    req.ability.throwUnlessCan("read", await Repos.findByPk(req.params.id));
    const repo = await Repos.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (repo) res.status(200).json(repo);
    else res.status(404).send("Repo is not found");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/repos", async (req, res) => {
  try {
    req.ability.throwUnlessCan("create", "Repos");
    const repo = await Repos.create({
      name: req.body.name,
      authorId: req.payload.id,
    });
    res.status(201).json(repo);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/api/repos/:id", async (req, res) => {
  try {
    req.ability.throwUnlessCan("update", await Repos.findByPk(req.params.id));
    await Repos.update(
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
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/api/repos/:id", async (req, res) => {
  try {
    req.ability.throwUnlessCan("manage", "all");
    await Repos.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).send("Repo is deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/repos/:id/commits", async (req, res) => {
  try {
    req.ability.throwUnlessCan("read", await Repos.findByPk(req.params.id));
    const commits = await Commits.findAll({
      include: [
        {
          model: Repos,
          required: true,
          where: {
            id: req.params.id,
          },
          attributes: [],
        },
      ],
    });
    res.status(200).json(commits);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/repos/:id/commits/:commitId", async (req, res) => {
  try {
    req.ability.throwUnlessCan("read", await Repos.findByPk(req.params.id));
    const commit = await Commits.findOne({
      where: {
        id: req.params.commitId,
      },
      include: [
        {
          model: Repos,
          required: true,
          where: {
            id: req.params.id,
          },
          attributes: [],
        },
      ],
    });
    if (commit) res.status(200).json(commit);
    else res.status(404).send("Commit is not found");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/repos/:id/commits", async (req, res) => {
  try {
    req.ability.throwUnlessCan("create", await Repos.findByPk(req.params.id));
    const commit = await Commits.create({
      message: req.body.message,
      repoId: req.params.id,
    });
    res.status(201).send(commit);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/api/repos/:id/commits/:commitId", async (req, res) => {
  try {
    req.ability.throwUnlessCan("update", await Repos.findByPk(req.params.id));
    await Commits.update(
      {
        message: req.body.message,
      },
      {
        where: {
          id: req.params.commitId,
        },
        include: [
          {
            model: Repos,
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
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/api/repos/:id/commits/:commitId", async (req, res) => {
  try {
    req.ability.throwUnlessCan("manage", "all");
    await Commits.destroy({
      where: {
        id: req.params.commitId,
      },
      include: [
        {
          model: Repos,
          required: true,
          where: {
            id: req.params.id,
          },
          attributes: [],
        },
      ],
    });
    res.status(200).send("Commit is deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});
