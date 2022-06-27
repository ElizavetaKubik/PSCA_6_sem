async function login() {
  try {
    const username = document.getElementsByName("username")[0].value;
    const password = document.getElementsByName("number")[0].value;

    if (!username || !password) {
      return;
    }

    let result = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    result.json();
  } catch (e) {
    console.log("error");
  }
}

async function register() {
  try {
    const username = document.getElementsByName("username")[0].value;
    const email = document.getElementsByName("email")[0].value;
    const password = document.getElementsByName("password")[0].value;

    if (!username || !email || !password) {
      return;
    }

    if (!/^[\w]+@[\w]+\.[\w]{2,4}$/.test(email)) {
      return;
    }

    let result = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (result.status == 200) {
      window.location.href = "/resource";
    } else {
      window.location.href = "/register";
    }
  } catch (e) {
    console.log(e);
  }
}

document.addEventListener("keydown", function (event) {
  if (event.code == "Enter" && document.getElementById("loginBtn") != null) {
    console.log(document.getElementById("loginBtn"));
    login();
  } else if (
    event.code == "Enter" &&
    document.getElementById("registerBtn") != null
  ) {
    register();
  }
});
