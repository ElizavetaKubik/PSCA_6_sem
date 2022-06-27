module.exports = {
  async getAuditoriumType(AuditoriumTypeModel, inAuditoriumType) {
    let result = null;
    await AuditoriumTypeModel.findAll({
      where: { auditorium_type: inAuditoriumType },
    }).then((data) => {
      result = JSON.stringify(data);
    });
    return result;
  },
  async getAuditoriumTypes(AuditoriumTypeModel) {
    let result = null;
    await AuditoriumTypeModel.findAll().then((data) => {
      result = JSON.stringify(data);
    });
    return result;
  },
  async insertAuditoriumType(
    AuditoriumTypeModel,
    inAuditoriumType,
    inAuditoriumTypeName
  ) {
    let result = null;
    await AuditoriumTypeModel.create({
      auditorium_type: inAuditoriumType,
      auditorium_typename: inAuditoriumTypeName,
    })
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
  },
  async updateAuditoriumType(
    AuditoriumTypeModel,
    inAuditoriumType,
    inAuditoriumTypeName
  ) {
    let result = null;
    await AuditoriumTypeModel.update(
      { auditorium_typename: inAuditoriumTypeName },
      { where: { auditorium_type: inAuditoriumType } }
    )
      .then((data) => {
        result = JSON.stringify(data);
      })
      .catch(() => {
        result = JSON.stringify("Bad insert");
      });
    return result;
  },
  async deleteAuditoriumType(AuditoriumTypeModel, inAuditoriumType) {
    let result = null;
    await AuditoriumTypeModel.destroy({
      where: { auditorium_type: inAuditoriumType },
    })
      .then((data) => {
        result = JSON.stringify({
          succes: `Auditorium type ${inAuditoriumType} was deleted`,
        });
      })
      .catch(() => {
        result = JSON.stringify("Bad delete");
      });
    return result;
  },
};
