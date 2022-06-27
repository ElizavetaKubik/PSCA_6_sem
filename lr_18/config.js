const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  username: "KEV_PSCA",
  password: "1111",
  database: "KEV_PSCA",
  host: "localhost",
  port: 1433,
  dialect: "mssql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("success connection.");
  })
  .catch((err) => {
    console.log("Error while BD connecting: " + err);
  });

module.exports = sequelize;
