#!/usr/bin/env node
// eas-wrapper-graphql-debug.js
const { spawn } = require("child_process");
const https = require("https");

function gqlRequest(query, token, maxRetries = 3) {
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

  const attemptRequest = (attempt = 1) => {
    const startTime = Date.now();
    console.log(
      `[${new Date().toISOString()}] GraphQL request attempt #${attempt} START`
    );

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        const duration = Date.now() - startTime;
        console.log(
          `[${new Date().toISOString()}] GraphQL request attempt #${attempt} END, Status: ${res.statusCode}, Duration: ${duration}ms, Body: ${body}`
        );
      });
    });

    req.on("error", (err) => {
      const duration = Date.now() - startTime;
      console.error(
        `[${new Date().toISOString()}] GraphQL request attempt #${attempt} ERROR, Duration: ${duration}ms, Error: ${err.message}`
      );
      if (attempt < maxRetries) {
        console.log(
          `[${new Date().toISOString()}] Retrying GraphQL request... (${attempt + 1}/${maxRetries})`
        );
        attemptRequest(attempt + 1);
      }
    });

    req.write(data);
    req.end();
  };

  attemptRequest();
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

// Automatically log viewer query before any EAS CLI command
if (process.env.EXPO_TOKEN) {
  gqlRequest("query { viewer { username } }", process.env.EXPO_TOKEN, 3);
}

const args = process.argv.slice(2);
runEas(args);
