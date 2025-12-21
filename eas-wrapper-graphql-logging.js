#!/usr/bin/env node
// eas-wrapper-graphql-logging.js
const { spawn } = require("child_process");
const https = require("https");

function gqlRequest(query, token, retries = 3) {
  const data = JSON.stringify({ query });

  const options = {
    hostname: "api.expo.dev",
    port: 443,
    path: "/graphql",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
      Authorization: `Bearer ${token}`,
    },
  };

  const makeRequest = (attempt = 1) => {
    console.log(
      `[${new Date().toISOString()}] GraphQL request attempt #${attempt}`
    );
    const startTime = Date.now();

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        const duration = Date.now() - startTime;
        console.log(
          `[${new Date().toISOString()}] Status: ${res.statusCode}, Duration: ${duration}ms`
        );
        console.log(
          `[${new Date().toISOString()}] Response: ${body.substring(0, 300)}${body.length > 300 ? "..." : ""}`
        );
      });
    });

    req.on("error", (err) => {
      const duration = Date.now() - startTime;
      console.error(
        `[${new Date().toISOString()}] GraphQL Error after ${duration}ms: ${err.message}`
      );
      if (attempt < retries) {
        console.log(
          `[${new Date().toISOString()}] Retrying GraphQL request...`
        );
        setTimeout(() => makeRequest(attempt + 1), 1000);
      }
    });

    req.write(data);
    req.end();
  };

  makeRequest();
}

function runEas(args, retries = 3) {
  const env = { ...process.env };
  delete env.NODE_TLS_REJECT_UNAUTHORIZED;

  console.log(
    `[${new Date().toISOString()}] Running: eas-cli ${args.join(" ")}`
  );

  const eas = spawn("npx", ["eas-cli", ...args], { stdio: "pipe", env });

  eas.stdout.on("data", (data) => process.stdout.write(data));
  eas.stderr.on("data", (data) => process.stderr.write(data));

  eas.on("close", (code) => {
    console.log(
      `[${new Date().toISOString()}] EAS CLI exited with code ${code}`
    );
    if (code !== 0 && retries > 0) {
      console.log(
        `[${new Date().toISOString()}] Retrying EAS CLI... (${retries} left)`
      );
      runEas(args, retries - 1);
    } else if (code !== 0) {
      console.log(`[${new Date().toISOString()}] EAS CLI failed after retries`);
    }
  });

  eas.on("error", (err) => {
    console.error(
      `[${new Date().toISOString()}] Failed to start EAS CLI:`,
      err.message
    );
  });
}

// Automatically log viewer query before running any EAS CLI command
if (process.env.EXPO_TOKEN) {
  console.log(
    `[${new Date().toISOString()}] Pre-flight GraphQL connectivity test...`
  );
  gqlRequest("query { viewer { username } }", process.env.EXPO_TOKEN);
}

const args = process.argv.slice(2);
setTimeout(() => runEas(args), 2000); // Give GraphQL request time to complete
