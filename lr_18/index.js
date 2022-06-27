const http = require("http");
const fs = require("fs");

const Sequelize = require("sequelize");
const sequelize = require("./config");

const { Faculty, Pulpit, Subject, AuditoriumType, Auditorium } =
  require("./models").Models(sequelize);

const FacultyHandler = require("./Handlers/faculty");
const PulpitHandler = require("./Handlers/pulpit");
const SubjectHandler = require("./Handlers/subject");
const AuditoriumHandler = require("./Handlers/auditorium");
const AuditoriumTypeHandler = require("./Handlers/auditorium_type");

function badUrl(res) {
  res.statusCode = 400;
  res.end("Bad url.");
}

function getHandler(req, res) {
  let pathname = req.url;
  let urlElems = pathname.split("/");

  if (pathname == "/") {
    let html = fs.readFileSync("./index.html");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  } else {
    if (urlElems.length == 3) {
      if (urlElems[1] == "api") {
        switch (urlElems[2]) {
          case "faculties": {
            FacultyHandler.getFaculties(Faculty).then((result) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(result);
            });
            break;
          }
          case "pulpits": {
            PulpitHandler.getPulpits(Pulpit).then((result) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(result);
            });
            break;
          }
          case "subjects": {
            SubjectHandler.getSubjects(Subject).then((result) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(result);
            });
            break;
          }
          case "auditoriumstypes": {
            AuditoriumTypeHandler.getAuditoriumTypes(AuditoriumType).then(
              (result) => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(result);
              }
            );
            break;
          }
          case "auditoriums": {
            AuditoriumHandler.getAuditoriums(Auditorium).then((result) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(result);
            });
            break;
          }
          case "auditoriums60": {
            AuditoriumHandler.getAuditoriumsgt60(Auditorium).then((result) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(result);
            });
            break;
          }
          case "transaction": {
            sequelize
              .transaction({
                isolationLevel:
                  Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
              })
              .then((t) => {
                return Pulpit.create(
                  { pulpit: "test", pulpit_name: "testName", faculty: "TOV" },
                  { transaction: t }
                ).then((r) => {
                  setTimeout(() => {
                    console.log("rollback", r);
                    return t.rollback();
                  }, 10000);  
                });
              })
              .then(() => {
                res.end();
              });
            break;
          }
          default: {
            badUrl(res);
            break;
          }
        }
      } else {
        badUrl(res);
      }
    } else if (urlElems.length == 5) {
      if (urlElems[1] == "api") {
        if ((urlElems[2] == "faculties") & (urlElems[4] == "pulpits")) {
          FacultyHandler.pulpitsOnFaculty(Faculty, urlElems[3]).then(
            (result) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(result);
            }
          );
        } else if ((urlElems[2] == "faculties") & (urlElems[4] == "teachers")) {
          FacultyHandler.teachersOnFaculty(Faculty, urlElems[3]).then(
            (result) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(result);
            }
          );
        } else {
          badUrl(res);
        }
      } else {
        badUrl(res);
      }
    } else {
      badUrl(res);
    }
  }
}

function postHandler(req, res) {
  let pathname = req.url;
  let urlElems = pathname.split("/");
  if (urlElems.length == 3) {
    if (urlElems[1] == "api") {
      switch (urlElems[2]) {
        case "faculties": {
          let body = "";
          req.on("data", (data) => {
            body += data.toString();
            body = JSON.parse(body);
          });
          req.on("end", () => {
            FacultyHandler.getFaculty(Faculty, body.faculty).then((result) => {
              if (result == "[]") {
                FacultyHandler.insertFaculty(
                  Faculty,
                  body.faculty,
                  body.faculty_name
                ).then(() => {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end("Success");
                });
              } else {
                res.statusCode = 400;
                res.end("This faculty already exists.");
              }
            });
          });
          break;
        }
        case "pulpits": {
          let body = "";
          req.on("data", (data) => {
            body += data.toString();
            body = JSON.parse(body);
          });
          req.on("end", () => {
            FacultyHandler.getFaculty(Faculty, body.faculty).then((result) => {
              if (result != "[]") {
                PulpitHandler.getPulpit(Pulpit, body.pulpit).then((result) => {
                  if (result == "[]") {
                    PulpitHandler.insertPulpit(
                      Pulpit,
                      body.pulpit,
                      body.pulpit_name,
                      body.faculty
                    ).then(() => {
                      res.writeHead(200, {
                        "Content-Type": "application/json",
                      });
                      res.end("Success");
                    });
                  } else {
                    res.statusCode = 400;
                    res.end("This pulpit already exists.");
                  }
                });
              } else {
                res.statusCode = 400;
                res.end("This faculty doesn't exist.");
              }
            });
          });
          break;
        }
        case "subjects": {
          let body = "";
          req.on("data", (data) => {
            body += data.toString();
            body = JSON.parse(body);
          });
          req.on("end", () => {
            PulpitHandler.getPulpit(Pulpit, body.pulpit).then((result) => {
              if (result != "[]") {
                SubjectHandler.getSubject(Subject, body.subject).then(
                  (result) => {
                    if (result == "[]") {
                      SubjectHandler.insertSubject(
                        Subject,
                        body.subject,
                        body.subject_name,
                        body.pulpit
                      ).then(() => {
                        res.writeHead(200, {
                          "Content-Type": "application/json",
                        });
                        res.end("Success");
                      });
                    } else {
                      res.end("This subject already exists.");
                    }
                  }
                );
              } else {
                res.statusCode = 400;
                res.end("This pulpit doesn't exist.");
              }
            });
          });
          break;
        }
        case "auditoriumstypes": {
          let body = "";
          req.on("data", (data) => {
            body += data.toString();
            body = JSON.parse(body);
          });
          req.on("end", () => {
            AuditoriumTypeHandler.getAuditoriumType(
              AuditoriumType,
              body.auditorium_type
            ).then((result) => {
              if (result == "[]") {
                AuditoriumTypeHandler.insertAuditoriumType(
                  AuditoriumType,
                  body.auditorium_type,
                  body.auditorium_typename
                ).then(() => {
                  res.writeHead(200, {
                    "Content-Type": "application/json",
                  });
                  res.end("Success");
                });
              } else {
                res.statusCode = 400;
                res.end("This auditorium type already exists.");
              }
            });
          });
          break;
        }
        case "auditoriums": {
          let body = "";
          req.on("data", (data) => {
            body += data.toString();
            body = JSON.parse(body);
          });
          req.on("end", () => {
            AuditoriumTypeHandler.getAuditoriumType(
              AuditoriumType,
              body.auditorium_type
            ).then((result) => {
              if (result != "[]") {
                AuditoriumHandler.getAuditorium(
                  Auditorium,
                  body.auditorium
                ).then((result) => {
                  if (result == "[]") {
                    AuditoriumHandler.insertAuditorium(
                      Auditorium,
                      body.auditorium,
                      body.auditorium_name,
                      body.auditorium_capacity,
                      body.auditorium_type
                    ).then(() => {
                      res.writeHead(200, {
                        "Content-Type": "application/json",
                      });
                      res.end("Success");
                    });
                  } else {
                    res.end("This auditorium already exists.");
                  }
                });
              } else {
                res.statusCode = 400;
                res.end("This auditorium type doesn't exist.");
              }
            });
          });
          break;
        }
        default: {
          badUrl(res);
          break;
        }
      }
    } else {
      badUrl(res);
    }
  } else {
    badUrl(res);
  }
}

function putHandler(req, res) {
  let pathname = req.url;
  let urlElems = pathname.split("/");
  if (urlElems.length == 3) {
    if (urlElems[1] == "api") {
      switch (urlElems[2]) {
        case "faculties": {
          let body = "";
          req.on("data", (data) => {
            body += data.toString();
            body = JSON.parse(body);
          });
          req.on("end", () => {
            FacultyHandler.getFaculty(Faculty, body.faculty).then((result) => {
              if (result != "[]") {
                FacultyHandler.updateFaculty(
                  Faculty,
                  body.faculty,
                  body.faculty_name
                ).then((result) => {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end("Success");
                });
              } else {
                res.statusCode = 400;
                res.end("This faculty doesn't exist.");
              }
            });
          });
          break;
        }
        case "pulpits": {
          let body = "";
          req.on("data", (data) => {
            body += data.toString();
            body = JSON.parse(body);
          });
          req.on("end", () => {
            PulpitHandler.getPulpit(Pulpit, body.pulpit).then((result) => {
              if (result != "[]") {
                PulpitHandler.updatePulpit(
                  Pulpit,
                  body.pulpit,
                  body.pulpit_name
                ).then(() => {
                  res.writeHead(200, {
                    "Content-Type": "application/json",
                  });
                  res.end("Success");
                });
              } else {
                res.end("This pulpit doesn't exist.");
              }
            });
          });
          break;
        }
        case "subjects": {
          let body = "";
          req.on("data", (data) => {
            body += data.toString();
            body = JSON.parse(body);
          });
          req.on("end", () => {
            SubjectHandler.getSubject(Subject, body.subject).then((result) => {
              if (result != "[]") {
                SubjectHandler.updateSubject(
                  Subject,
                  body.subject,
                  body.subject_name
                ).then(() => {
                  res.writeHead(200, {
                    "Content-Type": "application/json",
                  });
                  res.end("Success");
                });
              } else {
                res.end("This subject doesn't exist.");
              }
            });
          });
          break;
        }
        case "auditoriumstypes": {
          let body = "";
          req.on("data", (data) => {
            body += data.toString();
            body = JSON.parse(body);
          });
          req.on("end", () => {
            AuditoriumTypeHandler.getAuditoriumType(
              AuditoriumType,
              body.auditorium_type
            ).then((result) => {
              if (result != "[]") {
                AuditoriumTypeHandler.updateAuditoriumType(
                  AuditoriumType,
                  body.auditorium_type,
                  body.auditorium_typename
                ).then(() => {
                  res.writeHead(200, {
                    "Content-Type": "application/json",
                  });
                  res.end("Success");
                });
              } else {
                res.end("This auditorium type doesn't exist.");
              }
            });
          });
          break;
        }
        case "auditoriums": {
          let body = "";
          req.on("data", (data) => {
            body += data.toString();
            body = JSON.parse(body);
          });
          req.on("end", () => {
            AuditoriumHandler.getAuditorium(Auditorium, body.auditorium).then(
              (result) => {
                if (result != "[]") {
                  AuditoriumHandler.updateAuditorium(
                    Auditorium,
                    body.auditorium,
                    body.auditorium_name
                  ).then(() => {
                    res.writeHead(200, {
                      "Content-Type": "application/json",
                    });
                    res.end("Success");
                  });
                } else {
                  res.end("This auditorium doesn't exist.");
                }
              }
            );
          });
          break;
        }
        default: {
          badUrl(res);
          break;
        }
      }
    } else {
      badUrl(res);
    }
  } else {
    badUrl(res);
  }
}

function deleteHandler(req, res) {
  let pathname = req.url;
  let urlElems = pathname.split("/");
  if (urlElems.length == 4) {
    if (urlElems[1] == "api") {
      switch (urlElems[2]) {
        case "faculties": {
          FacultyHandler.getFaculty(Faculty, urlElems[3]).then((result) => {
            if (result != "[]") {
              FacultyHandler.deleteFacylty(Faculty, urlElems[3]).then(
                (result) => {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end("Success");
                }
              );
            } else {
              res.statusCode = 400;
              res.end("This faculty doesn't exist.");
            }
          });
          break;
        }
        case "pulpits": {
          PulpitHandler.getPulpit(Pulpit, urlElems[3]).then((result) => {
            if (result != "[]") {
              PulpitHandler.deletePulpit(Pulpit, urlElems[3]).then((result) => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end("Success");
              });
            } else {
              res.statusCode = 400;
              res.end("This pulpit doesn't exist.");
            }
          });
          break;
        }
        case "subjects": {
          SubjectHandler.getSubject(Subject, urlElems[3]).then((result) => {
            if (result != "[]") {
              SubjectHandler.deleteSubject(Subject, urlElems[3]).then(
                (result) => {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end("Success");
                }
              );
            } else {
              res.statusCode = 400;
              res.end("This subject doesn't exist.");
            }
          });
          break;
        }
        case "auditoriumstypes": {
          AuditoriumTypeHandler.getAuditoriumType(
            AuditoriumType,
            urlElems[3]
          ).then((result) => {
            if (result != "[]") {
              AuditoriumTypeHandler.deleteAuditoriumType(
                AuditoriumType,
                urlElems[3]
              ).then((result) => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end("Success");
              });
            } else {
              res.statusCode = 400;
              res.end("This auditorium type doesn't exist.");
            }
          });
          break;
        }
        case "auditoriums": {
          AuditoriumHandler.getAuditorium(Auditorium, urlElems[3]).then(
            (result) => {
              if (result != "[]") {
                AuditoriumHandler.deleteAuditorium(
                  Auditorium,
                  urlElems[3]
                ).then((result) => {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end("Success");
                });
              } else {
                res.statusCode = 400;
                res.end("This auditorium doesn't exist.");
              }
            }
          );
          break;
        }
        default: {
          badUrl(res);
          break;
        }
      }
    } else {
      badUrl(res);
    }
  } else {
    badUrl(res);
  }
}

http
  .createServer((req, res) => {
    switch (req.method) {
      case "GET": {
        getHandler(req, res);
        break;
      }
      case "POST": {
        postHandler(req, res);
        break;
      }
      case "PUT": {
        putHandler(req, res);
        break;
      }
      case "DELETE": {
        deleteHandler(req, res);
        break;
      }
      default: {
        res.statusCode = 400;
        res.end(JSON.stringify("Bad method."));
        break;
      }
    }
  })
  .listen(3000, () => {
    console.log("Started on 3000 port");
  });
