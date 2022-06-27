const Router = require("express");
const commitRouter = new Router();
const commitController = require("../controller/commit");

commitRouter.get("/api/repos/:id/commits", commitController.getCommits);
commitRouter.get(
  "/api/repos/:id/commits/:commitId",
  commitController.getCommitInfo
);
commitRouter.post("/api/repos/:id/commits", commitController.createCommit);
commitRouter.put(
  "/api/repos/:id/commits/:commitId",
  commitController.updateCommit
);
commitRouter.delete(
  "/api/repos/:id/commits/:commitId",
  commitController.deleteCommit
);

module.exports = commitRouter;
