const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Faculty extends Model {}
class Pulpit extends Model {}
class Subject extends Model {}

let ModelsSetUp = (sequelize) => {
  Faculty.init(
    {
      faculty: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      faculty_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Faculty",
      tableName: "Faculty",
      timestamps: false,
    }
  );

  Pulpit.init(
    {
      pulpit: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      pulpit_name: {
        type: Sequelize.STRING,
      },
      faculty: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: Faculty,
          key: "faculty",
        },
      },
    },
    {
      sequelize,
      modelName: "Pulpit",
      tableName: "Pulpit",
      timestamps: false,
    }
  );

  Subject.init(
    {
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      subject_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pulpit: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: Pulpit,
          key: "pulpit",
        },
      },
    },
    {
      sequelize,
      modelName: "Subject",
      tableName: "Subject",
      timestamps: false,
    }
  );

  Faculty.hasMany(Pulpit, {
    as: "faculty_pulpits",
    foreignKey: "faculty",
    sourceKey: "faculty",
  });
  Pulpit.hasMany(Subject, {
    as: "pulpit_subjects",
    foreignKey: "pulpit",
    sourceKey: "pulpit",
  });

  return { Faculty, Pulpit, Subject };
};

module.exports.Models = (sequelize) => ModelsSetUp(sequelize);
