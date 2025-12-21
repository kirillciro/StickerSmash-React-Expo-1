#!/usr/bin/env node
// eas-wrapper-graphql-debug-logfile.js
const { spawn } = require("child_process");
const https = require("https");
const fs = require("fs");
const path = require("path");

// Create a log file in the current folder
const logFile = path.join(process.cwd(), "eas-debug.log");
const logStream = fs.createWriteStream(logFile, { flags: "a" });

function log(message) {
  const timestamp = `[${new Date().toISOString()}]`;
  const fullMessage = `${timestamp} ${message}\n`;
  process.stdout.write(fullMessage);
  logStream.write(fullMessage);
}

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
    log(`GraphQL request attempt #${attempt} START`);

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        const duration = Date.now() - startTime;
        log(
          `GraphQL request attempt #${attempt} END, Status: ${res.statusCode}, Duration: ${duration}ms, Body: ${body}`
        );
      });
    });

    req.on("error", (err) => {
      const duration = Date.now() - startTime;
      log(
        `GraphQL request attempt #${attempt} ERROR, Duration: ${duration}ms, Error: ${err.message}`
      );
      if (attempt < maxRetries) {
        log(`Retrying GraphQL request... (${attempt + 1}/${maxRetries})`);
        setTimeout(() => attemptRequest(attempt + 1), 1000);
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

  log(`Running: eas-cli ${args.join(" ")}`);

  const eas = spawn("npx", ["eas-cli", ...args], { stdio: "pipe", env });

  eas.stdout.on("data", (data) => {
    process.stdout.write(data);
    logStream.write(data);
  });

  eas.stderr.on("data", (data) => {
    process.stderr.write(data);
    logStream.write(data);
  });

  eas.on("close", (code) => {
    log(`EAS CLI exited with code ${code}`);
    if (code !== 0 && retries > 0) {
      log(`Retrying EAS CLI... (${retries} left)`);
      runEas(args, retries - 1);
    } else if (code !== 0) {
      log(`EAS CLI failed after retries`);
      logStream.end();
      process.exit(1);
    } else {
      logStream.end();
    }
  });

  eas.on("error", (err) => {
    log(`Failed to start EAS CLI: ${err.message}`);
    logStream.end();
    process.exit(1);
  });
}

// Initialize logging
log(`EAS CLI Debug Session Started - PID: ${process.pid}`);
log(`Log file: ${logFile}`);

// Pre-flight GraphQL test
if (process.env.EXPO_TOKEN) {
  log(`Pre-flight GraphQL connectivity test starting...`);
  gqlRequest("query { viewer { username } }", process.env.EXPO_TOKEN, 3);
} else {
  log(`No EXPO_TOKEN provided, skipping pre-flight test`);
}

// Run EAS CLI command
const args = process.argv.slice(2);
setTimeout(() => runEas(args), 2000); // Give GraphQL request time to complete
