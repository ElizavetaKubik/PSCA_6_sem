const Router = require("express");
const repoRouter = new Router();
const repoController = require("../controller/repo");

repoRouter.get("/api/repos", repoController.showRepos);
repoRouter.get("/api/repos/:id", repoController.showRepo);
repoRouter.post("/api/repos", repoController.addRepo);
repoRouter.put("/api/repos/:id", repoController.updateRepo);
repoRouter.delete("/api/repos/:id", repoController.deleteRepo);

module.exports = repoRouter;
