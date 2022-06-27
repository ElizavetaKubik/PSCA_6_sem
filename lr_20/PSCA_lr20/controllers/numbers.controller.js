const fs = require("fs");
const path = require("path");

let numbersList = require("../numbers.json");

class NumbersController {
  static async showIndex(req, res) {
    res.render("index", {
      unlocked: true,
      numbers: numbersList,
    });
  }
  static async showAdd(req, res) {
    res.render("add", {
      unlocked: false,
      numbers: numbersList,
      helpers: {
        cancel: () => "window.location.href = '/'",
      },
    });
  }
  static async showUpdate(req, res) {
    let targetNumber = numbersList.find((number) => number.id == req.query.id);

    res.render("update", {
      unlocked: false,
      numbers: numbersList,
      targetNumber: targetNumber,
      helpers: {
        cancel: () => "window.location.href = '/'",
      },
    });
  }
  static async addNumber(req, res) {
    const surname = req.body.surname;
    const number = req.body.number;

    let max = numbersList.reduce((acc, curr) =>
      acc.id > curr.id ? acc : curr
    );
    console.log(max);

    const newNumber = {
      id: max.id + 1,
      surname,
      number,
    };

    numbersList.push(newNumber);
    NumbersController.save();
    res.json(newNumber);
  }
  static async updateNumber(req, res) {
    const id = req.body.id;
    const surname = req.body.surname;
    const number = req.body.number;

    let targetNumber = numbersList.find((number) => number.id == id);

    targetNumber.surname = surname;
    targetNumber.number = number;
    NumbersController.save();
    res.json(targetNumber);
  }
  static async deleteNumber(req, res) {
    const id = req.body.id;
    numbersList = numbersList.filter((number) => number.id != id);
    NumbersController.save();
    res.json(numbersList);
  }
  static async save() {
    await fs.writeFile(
      path.parse(__dirname).dir + "\\numbers.json",
      JSON.stringify(numbersList, null, "  "),
      () => {}
    );
  }
}

module.exports = NumbersController;
