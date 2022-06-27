module.exports = {
  async getSubject(SubjectModel, inSubject) {
    let result = null;
    await SubjectModel.findAll({ where: { subject: inSubject } }).then(
      (data) => {
        result = JSON.stringify(data);
      }
    );
    return result;
  },
  async getSubjects(SubjectModel) {
    let result = null;
    await SubjectModel.findAll().then((data) => {
      result = JSON.stringify(data);
    });
    return result;
  },
  async insertSubject(SubjectModel, inSubject, inSubjectName, inPulpit) {
    let result = null;
    await SubjectModel.create({
      subject: inSubject,
      subject_name: inSubjectName,
      pulpit: inPulpit,
    })
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
  },
  async updateSubject(SubjectModel, inSubject, inSubjectName) {
    let result = null;
    await SubjectModel.update(
      { subject_name: inSubjectName },
      { where: { subject: inSubject } }
    )
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
    return result;
  },
  async deleteSubject(SubjectModel, inSubject) {
    let result = null;
    await SubjectModel.destroy({ where: { subject: inSubject } })
      .then((data) => {
        result = JSON.stringify({
          succes: `Subject ${inSubject} was deleted`,
        });
      })
      .catch(() => {
        result = JSON.stringify("Bad delete");
      });
    return result;
  },
};
