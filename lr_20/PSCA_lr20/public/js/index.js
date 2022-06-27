async function addRecord() {
  console.log("--try to add");
  const surname = document.getElementsByName("surname")[0].value;
  let number = document.getElementsByName("number")[0].value;

  if (!surname || !number) {
    return;
  }

  if (!/^\+?375((29)|(33)|(44)){1}\d{7}$/.test(number)) {
    return;
  }

  if (number.length == 13) {
    number =
      number.slice(0, 4) +
      " (" +
      number.slice(4, 6) +
      ") " +
      number.slice(6, 9) +
      " " +
      number.slice(9, 11) +
      " " +
      number.slice(11, 13);
  } else if (number.length == 12) {
    number =
      "+" +
      number.slice(0, 3) +
      " (" +
      number.slice(3, 5) +
      ") " +
      number.slice(5, 8) +
      " " +
      number.slice(8, 10) +
      " " +
      number.slice(10, 12);
  }

  let result = await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ surname, number }),
  });
  result.json();
  window.location.href = "/";
}

async function updateRecord() {
  console.log("--try to update");

  const id = document
    .getElementsByClassName("directory-group edit")[0]
    .getAttribute("data-key");
  const surname = document.getElementsByName("surname")[0].value;
  const number = document.getElementsByName("number")[0].value;

  if (!surname || !number) {
    return;
  }

  if (!/^\+375 \(((29)|(33)|(44)){1}\) \d{3} \d{2} \d{2}$/.test(number)) {
    return;
  }

  let result = await fetch("/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, surname, number }),
  });
  result.json();
  window.location.href = "/";
}

async function deleteRecord() {
  const id = document
    .getElementsByClassName("directory-group edit")[0]
    .getAttribute("data-key");

  let result = await fetch("/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  result.json();
  window.location.href = "/";
}

function lockRemoveButton() {
  const removeButton = document.getElementById("remove-button");
  if (!removeButton) {
    return;
  }
  removeButton.setAttribute("disabled", "true");
}

document.addEventListener("keydown", function (event) {
  if (event.code == "Enter") {
    addRecord();
  }
});
