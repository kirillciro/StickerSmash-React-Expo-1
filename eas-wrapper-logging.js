#!/usr/bin/env node
// eas-wrapper-logging.js
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

  return new Promise((resolve, reject) => {
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
            `[${new Date().toISOString()}] Response: ${body.substring(0, 200)}${body.length > 200 ? "..." : ""}`
          );
          resolve({ status: res.statusCode, body });
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
        } else {
          reject(err);
        }
      });

      req.write(data);
      req.end();
    };

    makeRequest();
  });
}

async function testConnectivity() {
  console.log(`[${new Date().toISOString()}] Testing GraphQL connectivity...`);
  try {
    const token = process.env.EXPO_TOKEN;
    if (!token) {
      console.log(
        `[${new Date().toISOString()}] No EXPO_TOKEN found, skipping connectivity test`
      );
      return;
    }

    await gqlRequest("query { viewer { username } }", token);
    console.log(
      `[${new Date().toISOString()}] GraphQL connectivity test successful`
    );
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] GraphQL connectivity test failed:`,
      err.message
    );
  }
}

function runEas(args, retries = 3) {
  const env = { ...process.env };
  delete env.NODE_TLS_REJECT_UNAUTHORIZED;

  console.log(
    `[${new Date().toISOString()}] Running: eas-cli ${args.join(" ")}`
  );

  const eas = spawn("npx", ["eas-cli", ...args], {
    stdio: "pipe",
    env,
  });

  eas.stdout.on("data", (data) => {
    process.stdout.write(data);
  });

  eas.stderr.on("data", (data) => {
    process.stderr.write(data);
  });

  eas.on("close", (code) => {
    console.log(
      `[${new Date().toISOString()}] EAS CLI exited with code ${code}`
    );
    if (code !== 0 && retries > 0) {
      console.log(
        `[${new Date().toISOString()}] Retrying... (${retries} left)`
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

async function main() {
  // Test connectivity before running EAS CLI
  await testConnectivity();

  const args = process.argv.slice(2);
  runEas(args);
}

main().catch((err) => {
  console.error(`[${new Date().toISOString()}] Wrapper error:`, err.message);
  process.exit(1);
});
