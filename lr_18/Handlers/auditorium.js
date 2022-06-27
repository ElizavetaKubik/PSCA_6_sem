module.exports = {
  async getAuditorium(AuditoriumModel, inAuditorium) {
    let result = null;
    await AuditoriumModel.findAll({ where: { auditorium: inAuditorium } }).then(
      (data) => {
        result = JSON.stringify(data);
      }
    );
    return result;
  },
  async getAuditoriums(AuditoriumModel) {
    let result = null;
    await AuditoriumModel.findAll().then((data) => {
      result = JSON.stringify(data);
    });
    return result;
  },
  async insertAuditorium(
    AuditoriumModel,
    inAuditorium,
    inAuditoriumName,
    inAuditoriumCapacity,
    inAuditoriumType
  ) {
    let result = null;
    await AuditoriumModel.create({
      auditorium: inAuditorium,
      auditorium_name: inAuditoriumName,
      auditorium_capacity: inAuditoriumCapacity,
      auditorium_type: inAuditoriumType,
    })
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
  },
  async updateAuditorium(AuditoriumModel, inAuditorium, inAuditoriumName) {
    let result = null;
    await AuditoriumModel.update(
      { auditorium_name: inAuditoriumName },
      { where: { auditorium: inAuditorium } }
    )
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
    return result;
  },
  async deleteAuditorium(AuditoriumModel, inAuditorium) {
    let result = null;
    await AuditoriumModel.destroy({ where: { auditorium: inAuditorium } })
      .then((data) => {
        result = JSON.stringify({
          succes: `Auditorium ${inAuditorium} was deleted`,
        });
      })
      .catch(() => {
        result = JSON.stringify("Bad delete");
      });
    return result;
  },
  async getAuditoriumsgt60(AuditoriumModel) {
    let result = null;
    await AuditoriumModel.scope({ method: ["auditoriumsgt60"] })
      .findAll()
      .then((data) => {
        result = JSON.stringify(data);
      });
    return result;
  },
};
