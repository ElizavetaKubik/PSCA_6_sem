module.exports = {
  async getPulpit(PulpitModel, inPulpit) {
    let result = null;
    await PulpitModel.findAll({ where: { pulpit: inPulpit } }).then((data) => {
      result = JSON.stringify(data);
    });
    return result;
  },
  async getPulpits(PulpitModel) {
    let result = null;
    await PulpitModel.findAll().then((data) => {
      result = JSON.stringify(data);
    });
    return result;
  },
  async insertPulpit(PulpitModel, inPulpit, inPulpitName, inFaculty) {
    let result = null;
    await PulpitModel.create({
      pulpit: inPulpit,
      pulpit_name: inPulpitName,
      faculty: inFaculty,
    })
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
  },
  async updatePulpit(PulpitModel, inPulpit, inPulpitName) {
    let result = null;
    await PulpitModel.update(
      { pulpit_name: inPulpitName },
      { where: { pulpit: inPulpit } }
    )
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
    return result;
  },
  async deletePulpit(PulpitModel, inPulpit) {
    let result = null;
    await PulpitModel.destroy({ where: { pulpit: inPulpit } })
      .then((data) => {
        result = JSON.stringify({
          succes: `Pulpit ${inPulpit} was deleted`,
        });
      })
      .catch(() => {
        result = JSON.stringify("Bad delete");
      });
    return result;
  },
};
