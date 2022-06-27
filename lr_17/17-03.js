//исслед скорость вып 10000 запросов incr, decr

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

client.set("incr", 0);

var incrnow;
client.incr("incr", () => {
  incrnow = new Date();
});
for (let n = 1; n < 9999; n++) {
  client.incr("incr");
}
client.incr("incr", () => {
  console.log("Time incr: " + (new Date() - incrnow));
});

//-------------------------------------------------

var decrnow;
client.decr("incr", () => {
  decrnow = new Date();
});
for (let n = 1; n < 9999; n++) {
  client.decr("incr");
}
client.decr("incr", () => {
  console.log("Time decr: " + (new Date() - decrnow));
});
client.del("incr");
client.quit();
