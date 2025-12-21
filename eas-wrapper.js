#!/usr/bin/env node
// eas-wrapper.js
const { spawn } = require("child_process");

function runEas(args, retries = 3) {
  const env = { ...process.env };

  // Ensure we don't disable TLS verification (use system defaults)
  delete env.NODE_TLS_REJECT_UNAUTHORIZED;

  // Use Node's default HTTPS behavior (the one that works in test.js)
  const eas = spawn("npx", ["eas-cli", ...args], {
    stdio: "inherit",
    env,
  });

  eas.on("close", (code) => {
    if (code !== 0 && retries > 0) {
      console.log(
        `EAS CLI exited with code ${code}, retrying... (${retries} left)`
      );
      runEas(args, retries - 1);
    } else if (code !== 0) {
      console.log(`EAS CLI failed after retries (code ${code})`);
    }
  });

  eas.on("error", (err) => {
    console.error("Failed to start EAS CLI:", err);
  });
}

// Pass all CLI arguments to the wrapper
const args = process.argv.slice(2);
runEas(args);
