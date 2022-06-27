const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const facultyRouter = require("./routes/faculty.route");
const pulpitRouter = require("./routes/pulpit.route");
const subjectRouter = require("./routes/subject.route");

app.use("/faculty", facultyRouter);
app.use("/pulpit", pulpitRouter);
app.use("/subject", subjectRouter);

app.listen(3000, () => {
  console.log("Started on 3000 port.");
});
