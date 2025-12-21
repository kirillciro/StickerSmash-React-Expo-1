// force-http1.js
const https = require("https");

const data = JSON.stringify({
  query: "query { viewer { username } }",
});

const options = {
  hostname: "api.expo.dev",
  port: 443,
  path: "/graphql",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
    Authorization: "Bearer XC_D1xM-NQYXly8MbOtPGcRP9gXfllmEZQQ4AEtl",
  },
  // Force HTTP/1.1
  createConnection: (opts, callback) => {
    const tls = require("tls");
    const socket = tls.connect(
      {
        host: opts.hostname,
        port: opts.port,
        servername: opts.servername,
        minVersion: "TLSv1.2",
      },
      () => callback(null, socket)
    );
    return socket;
  },
};

function sendRequest(retries = 3) {
  const req = https.request(options, (res) => {
    console.log("StatusCode:", res.statusCode);
    let body = "";
    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => console.log("Response:", body));
  });

  req.on("error", (err) => {
    console.error("Request error:", err.message);
    if (retries > 0) {
      console.log(`Retrying... (${retries} left)`);
      sendRequest(retries - 1);
    }
  });

  req.write(data);
  req.end();
}

sendRequest();
