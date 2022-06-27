const redis = require("redis");
const pub_client = redis.createClient(
  "//redis-10578.c253.us-central1-1.gce.cloud.redislabs.com:10578",
  { password: "redis-22" }
);

pub_client.publish("channel-01", "from pub-client message 1");
pub_client.publish("channel-01", "from pub-client message 2");
setTimeout(
  () => pub_client.publish("channel-01", "from pub-client message 3"),
  5000
);
setTimeout(
  () => pub_client.publish("channel-01", "from pub-client message 4"),
  7000
);
setTimeout(
  () => pub_client.publish("channel-01", "from pub-client message 5"),
  9000
);
setTimeout(
  () => pub_client.publish("channel-01", "from pub-client message 6"),
  11000
);
setTimeout(() => pub_client.quit(), 15000);
