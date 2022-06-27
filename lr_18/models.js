const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const Op = Sequelize.Op;

class Faculty extends Model {}
class Pulpit extends Model {}
class Teacher extends Model {}
class Subject extends Model {}
class Auditorium extends Model {}
class AuditoriumType extends Model {}

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
      hooks: {
        beforeCreate: () => {
          console.log("--------before create faculty hook--------");
        },
        afterCreate: () => {
          console.log("--------after create faculty hook--------");
        },
      },
      scopes: {
        pulpitsOnFaculty(inFaculty) {
          return {
            include: [
              {
                model: Pulpit,
                as: "faculty_pulpits",
                where: { faculty: inFaculty },
              },
            ],
          };
        },
        teachersOnFaculty(inFaculty) {
          return {
            include: [
              {
                model: Pulpit,
                as: "faculty_pulpits",
                where: { faculty: inFaculty },
                include: {
                  model: Teacher,
                  as: "pulpit_teachers",
                },
              },
            ],
          };
        },
      },
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

  Teacher.init(
    {
      teacher: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      teacher_name: {
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
      modelName: "Teacher",
      tableName: "Teacher",
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

  AuditoriumType.init(
    {
      auditorium_type: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      auditorium_typename: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AuditoriumType",
      tableName: "Auditorium_Type",
      timestamps: false,
    }
  );

  Auditorium.init(
    {
      auditorium: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      auditorium_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      auditorium_capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      auditorium_type: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: AuditoriumType,
          key: "auditorium_type",
        },
      },
    },
    {
      sequelize,
      modelName: "Auditorium",
      tableName: "Auditorium",
      timestamps: false,
      scopes: {
        auditoriumsgt60() {
          return { where: { auditorium_capacity: { [Op.gte]: 60 } } };
        },
      },
    }
  );

  Faculty.hasMany(Pulpit, {
    as: "faculty_pulpits",
    foreignKey: "faculty",
    sourceKey: "faculty",
  });
  Pulpit.hasMany(Teacher, {
    as: "pulpit_teachers",
    foreignKey: "pulpit",
    sourceKey: "pulpit",
  });

  return { Faculty, Pulpit, Teacher, Subject, AuditoriumType, Auditorium };
};

module.exports.Models = (sequelize) => ModelsSetUp(sequelize);
