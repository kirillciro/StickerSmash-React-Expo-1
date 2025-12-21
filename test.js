const https = require("https");

const options = {
  hostname: "api.expo.dev",
  path: "/graphql",
  method: "POST",
  headers: {
    Authorization: "Bearer XC_D1xM-NQYXly8MbOtPGcRP9gXfllmEZQQ4AEtl",
    "Content-Type": "application/json",
  },
};

const req = https.request(options, (res) => {
  console.log("StatusCode:", res.statusCode);
  res.on("data", (d) => process.stdout.write(d));
});

req.on("error", (e) => console.error("Error:", e));
req.write(JSON.stringify({ query: "query { viewer { username } }" }));
req.end();
