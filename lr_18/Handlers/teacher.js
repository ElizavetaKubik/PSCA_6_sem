module.exports = {
  async getTeacher(TeacherModel, inTeacher) {
    let result = null;
    await TeacherModel.findAll({ where: { teacher: inTeacher } }).then(
      (data) => {
        result = JSON.stringify(data);
      }
    );
    return result;
  },
  async getTeachers(TeacherModel) {
    let result = null;
    await TeacherModel.findAll().then((data) => {
      result = JSON.stringify(data);
    });
    return result;
  },
  async insertTeacher(TeacherModel, inTeacher, inTeacherName, inPulpit) {
    let result = null;
    await TeacherModel.create({
      teacher: inTeacher,
      teacher_name: inTeacherName,
      pulpit: inPulpit,
    })
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
  },
  async updateTeacher(TeacherModel, inTeacher, inTeacherName) {
    let result = null;
    await TeacherModel.update(
      { teacher_name: inTeacherName },
      { where: { teacher: inTeacher } }
    )
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
    return result;
  },
  async deleteinTeacher(inTeacherModel, ininTeacher) {
    let result = null;
    await inTeacherModel
      .destroy({ where: { teacher: ininTeacher } })
      .then((data) => {
        result = JSON.stringify({
          succes: `inTeacher ${ininTeacher} was deleted`,
        });
      })
      .catch(() => {
        result = JSON.stringify("Bad delete");
      });
    return result;
  },
};
