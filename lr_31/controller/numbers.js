const fs = require("fs");
const path = require("path");

let numbers = require("../numbers.json") || [];

class NumbersController {
  static async getNumbers(req, res) {
    res.json(numbers);
  }

  static async addNumber(req, res) {
    const { name, number } = req.body;

    let max = numbers.reduce((acc, curr) => (acc.id > curr.id ? acc : curr));
    let newNumber = {
      id: max.id + 1,
      name,
      number,
    };

    if (name && number) {
      numbers.push(newNumber);

      NumbersController.save();
      res.json({ message: "Success." });
    } else {
      res.status(400).json({ message: "Error." });
    }
  }

  static async editNumber(req, res) {
    const { id, name, number } = req.body;
    if (id) {
      if ((name, number)) {
        let isNumber = numbers.find((phone) => phone.id == id);
        if (isNumber) {
          isNumber.name = name;
          isNumber.number = number;

          NumbersController.save();
          res.json({ message: "Success." });
        } else {
          res.status(404).json({ message: "Number doesn't exist." });
        }
      }
    } else {
      res.status(400).json({ message: "ID required." });
    }
  }

  static async deleteNumber(req, res) {
    const { id } = req.body;
    if (id) {
      let isNumber = numbers.find((phone) => phone.id == id);
      if (isNumber) {
        numbers = numbers.filter((phone) => phone.id != id);

        NumbersController.save();
        res.json({ message: "Success." });
      } else {
        res.status(404).json({ message: "Number doesn't exist." });
      }
    } else {
      res.status(400).json({ message: "ID required." });
    }
  }

  static async save() {
    await fs.writeFile(
      path.parse(__dirname).dir + "\\numbers.json",
      JSON.stringify(numbers, null, "  "),
      () => {}
    );
  }
}

module.exports = NumbersController;
