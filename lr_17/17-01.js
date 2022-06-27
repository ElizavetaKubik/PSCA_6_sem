const redis = require("redis");
const client = redis.createClient(
  "//redis-10578.c253.us-central1-1.gce.cloud.redislabs.com:10578",
  { password: "redis-22" }
);
client.on("ready", () => {
  console.log("ready");
});
client.on("error", (err) => {
  console.log("error " + err);
});
client.on("connect", () => {
  console.log("connect");
});
client.on("end", () => {
  console.log("end");
});
client.quit();

//тестир соедин с сервером БД Redis
