const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class UserCASL extends Model {}
class Repo extends Model {}
class Commit extends Model {}

let ModelSetUp = (sequelize) => {
  UserCASL.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserCASL",
      tableName: "UserCASL",
      timestamps: false,
    }
  );

  Repo.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Repo",
      tableName: "Repo",
    }
  );

  Commit.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      repoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Commit",
      tableName: "Commit",
    }
  );

  UserCASL.hasMany(Repo, {
    foreignKey: "authorId",
  });
  Repo.belongsTo(UserCASL, {
    foreignKey: "authorId",
  });

  Repo.hasMany(Commit, {
    foreignKey: "repoId",
  });
  Commit.belongsTo(Repo, {
    as: "repo_commit",
    foreignKey: "repoId",
    sourceKey: "repoId",
  });

  return { UserCASL, Repo, Commit };
};

module.exports.Models = (sequelize) => ModelSetUp(sequelize);
