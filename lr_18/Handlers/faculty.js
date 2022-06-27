module.exports = {
  async getFaculty(FacultyModel, inFaculty) {
    let result = null;
    await FacultyModel.findAll({ where: { faculty: inFaculty } }).then(
      (data) => {
        result = JSON.stringify(data);
      }
    );
    return result;
  },
  async getFaculties(FacultyModel) {
    let result = null;
    await FacultyModel.findAll().then((data) => {
      result = JSON.stringify(data);
    });
    return result;
  },
  async insertFaculty(FacultyModel, inFaculty, inFacultyName) {
    let result = null;
    await FacultyModel.create({
      faculty: inFaculty,
      faculty_name: inFacultyName,
    })
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
  },
  async updateFaculty(FacultyModel, inFaculty, inFacultyName) {
    let result = null;
    await FacultyModel.update(
      { faculty_name: inFacultyName },
      { where: { faculty: inFaculty } }
    )
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
    return result;
  },
  async deleteFacylty(FacultyModel, inFaculty) {
    let result = null;
    await FacultyModel.destroy({ where: { faculty: inFaculty } })
      .then((data) => {
        result = JSON.stringify({
          succes: `Faculty ${inFaculty} was deleted`,
        });
      })
      .catch(() => {
        result = JSON.stringify("Bad delete");
      });
    return result;
  },
  async pulpitsOnFaculty(FacultyModel, inFaculty) {
    let result = null;
    await FacultyModel.scope({ method: ["pulpitsOnFaculty", inFaculty] })
      .findAll()
      .then((data) => {
        result = JSON.stringify(data);
        if (result == "[]") {
          result = "There are no pulpits at this faculty yet.";
        }
      });
    return result;
  },
  async teachersOnFaculty(FacultyModel, inFaculty) {
    let result = null;
    await FacultyModel.scope({ method: ["teachersOnFaculty", inFaculty] })
      .findAll()
      .then((data) => {
        result = JSON.stringify(data);
        if (result == "[]") {
          result = "There are no teachers at this faculty yet.";
        }
      });
    return result;
  },
};
