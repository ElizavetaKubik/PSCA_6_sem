//демонстр механизм publish/subscribe

const redis = require("redis");
const sub_client = redis.createClient(
  "//redis-10578.c253.us-central1-1.gce.cloud.redislabs.com:10578",
  { password: "redis-22" }
);

sub_client.on("message", (channel, message) => {
  console.log("sub channel: " + channel + ":" + message);
});
sub_client.subscribe("channel-01");

setTimeout(() => {
  sub_client.unsubscribe();
  sub_client.quit();
}, 15000);

//-------------------------------------------------
