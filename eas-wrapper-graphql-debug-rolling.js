#!/usr/bin/env node
// eas-wrapper-graphql-debug-rolling.js
const { spawn } = require("child_process");
const https = require("https");
const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(process.cwd(), "eas-debug.log");
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10 MB

function openLogStream() {
  if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > MAX_LOG_SIZE) {
    const backupFile = LOG_FILE + ".1";
    if (fs.existsSync(backupFile)) fs.unlinkSync(backupFile);
    fs.renameSync(LOG_FILE, backupFile);
    console.log(`Log rotated: ${LOG_FILE} -> ${backupFile}`);
  }
  return fs.createWriteStream(LOG_FILE, { flags: "a" });
}

const logStream = openLogStream();

function log(message) {
  const timestamp = `[${new Date().toISOString()}]`;
  const fullMessage = `${timestamp} ${message}\n`;
  process.stdout.write(fullMessage);
  logStream.write(fullMessage);
}

// --- Stats tracking ---
const stats = {
  totalRequests: 0,
  successRequests: 0,
  failedRequests: 0,
  totalTime: 0,
  successfulTimes: [],
  errors: {},
  sessionStart: Date.now(),
  requestTimestamps: [], // epoch ms for peak analysis
  requestEvents: [], // { ts, success, errorType } for failure heatmap
};

// GraphQL request helper
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
    stats.requestTimestamps.push(startTime);
    stats.totalRequests++;
    log(`GraphQL request attempt #${attempt} START`);

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        const duration = Date.now() - startTime;
        stats.totalTime += duration;

        if (res.statusCode === 200) {
          stats.successRequests++;
          stats.successfulTimes.push(duration);

          stats.requestEvents.push({
            ts: startTime,
            success: true,
          });
        } else {
          stats.failedRequests++;
          const errorKey = `HTTP_${res.statusCode}`;
          stats.errors[errorKey] = (stats.errors[errorKey] || 0) + 1;

          stats.requestEvents.push({
            ts: startTime,
            success: false,
            errorType: errorKey,
          });
        }

        log(
          `GraphQL request attempt #${attempt} END, Status: ${res.statusCode}, Duration: ${duration}ms, Body: ${body}`
        );
      });
    });

    req.on("error", (err) => {
      const duration = Date.now() - startTime;
      stats.failedRequests++;
      stats.totalTime += duration;
      const errorKey = err.code || err.message;
      stats.errors[errorKey] = (stats.errors[errorKey] || 0) + 1;

      stats.requestEvents.push({
        ts: startTime,
        success: false,
        errorType: errorKey,
      });

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

// Run EAS CLI
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
    printStats();

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

// --- Failure heatmap analysis ---
function generateFailureHeatmap(windowMs = 1000) {
  const buckets = {};

  for (const evt of stats.requestEvents) {
    const bucket = Math.floor(evt.ts / windowMs) * windowMs;

    if (!buckets[bucket]) {
      buckets[bucket] = {
        total: 0,
        failures: 0,
        errorTypes: {},
      };
    }

    buckets[bucket].total++;
    if (!evt.success) {
      buckets[bucket].failures++;
      const errorType = evt.errorType || "unknown";
      buckets[bucket].errorTypes[errorType] =
        (buckets[bucket].errorTypes[errorType] || 0) + 1;
    }
  }

  return Object.entries(buckets)
    .map(([ts, data]) => ({
      windowStart: Number(ts),
      windowEnd: Number(ts) + windowMs,
      ...data,
      failureRate: data.failures / data.total,
    }))
    .sort((a, b) => a.windowStart - b.windowStart);
}

// --- Peak interval analysis ---
function analyzePeakIntervals(windowMs = 1000) {
  const buckets = {};

  for (const ts of stats.requestTimestamps) {
    const bucket = Math.floor(ts / windowMs) * windowMs;
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  }

  let peakBucket = null;
  let peakCount = 0;

  for (const [bucket, count] of Object.entries(buckets)) {
    if (count > peakCount) {
      peakCount = count;
      peakBucket = Number(bucket);
    }
  }

  return {
    peakRequests: peakCount,
    peakWindowStart: peakBucket,
    peakWindowEnd: peakBucket ? peakBucket + windowMs : null,
    averageRPS:
      stats.requestTimestamps.length /
      ((Date.now() - stats.sessionStart) / 1000),
  };
}

// --- Print statistics summary ---
function printStats() {
  const sessionDuration = (Date.now() - stats.sessionStart) / 1000; // seconds
  const avgTime = stats.successfulTimes.length
    ? (
        stats.successfulTimes.reduce((a, b) => a + b, 0) /
        stats.successfulTimes.length
      ).toFixed(2)
    : 0;
  const minTime = stats.successfulTimes.length
    ? Math.min(...stats.successfulTimes)
    : 0;
  const maxTime = stats.successfulTimes.length
    ? Math.max(...stats.successfulTimes)
    : 0;
  const successRate = stats.totalRequests
    ? ((stats.successRequests / stats.totalRequests) * 100).toFixed(1)
    : 0;

  const peak = analyzePeakIntervals();
  const heatmap = generateFailureHeatmap();

  log(`\n=== GraphQL Request Summary ===`);
  log(`Session duration: ${sessionDuration.toFixed(1)}s`);
  log(`Total requests: ${stats.totalRequests}`);
  log(`Successful: ${stats.successRequests} (${successRate}%)`);
  log(`Failed: ${stats.failedRequests}`);
  if (stats.successfulTimes.length > 0) {
    log(
      `Response times - Avg: ${avgTime}ms, Min: ${minTime}ms, Max: ${maxTime}ms`
    );
  }

  log(`\n--- Load Analysis ---`);
  log(`Average RPS: ${peak.averageRPS.toFixed(2)}`);
  log(`Peak RPS: ${peak.peakRequests}`);
  if (peak.peakWindowStart) {
    log(
      `Peak window: ${new Date(peak.peakWindowStart).toISOString()} → ${new Date(peak.peakWindowEnd).toISOString()}`
    );
  }

  // Failure heatmap - only show windows with failures
  const failureWindows = heatmap.filter((h) => h.failures > 0);
  if (failureWindows.length > 0) {
    log(`\n--- Failure Heatmap (per 1s window) ---`);
    for (const h of failureWindows) {
      const timeStr = new Date(h.windowStart).toISOString().substring(11, 19); // HH:MM:SS
      const errorSummary = Object.entries(h.errorTypes)
        .map(([type, count]) => `${type}:${count}`)
        .join(", ");
      log(
        `${timeStr} → total: ${h.total}, failures: ${h.failures} (${(h.failureRate * 100).toFixed(0)}%) [${errorSummary}]`
      );
    }
  } else {
    log(`\n--- Failure Heatmap ---`);
    log(`No failure windows detected (100% success rate)`);
  }

  if (Object.keys(stats.errors).length > 0) {
    log(`\n--- Error Summary ---`);
    Object.entries(stats.errors).forEach(([error, count]) => {
      log(`  ${error}: ${count} occurrences`);
    });
  }
  log(`===============================\n`);
}

// Initialize logging with session info
log(`EAS CLI Debug Session Started - PID: ${process.pid}`);
log(
  `Log file: ${LOG_FILE} (max size: ${Math.round(MAX_LOG_SIZE / 1024 / 1024)}MB)`
);

// Check current log file size
if (fs.existsSync(LOG_FILE)) {
  const currentSize = fs.statSync(LOG_FILE).size;
  log(`Current log size: ${Math.round(currentSize / 1024)}KB`);
}

// Pre-flight GraphQL test
if (process.env.EXPO_TOKEN) {
  log(`Pre-flight GraphQL connectivity test starting...`);
  gqlRequest("query { viewer { username } }", process.env.EXPO_TOKEN, 3);
} else {
  log(`No EXPO_TOKEN provided, skipping pre-flight test`);
}

// Run the requested EAS CLI command
const args = process.argv.slice(2);
setTimeout(() => runEas(args), 2000); // Give GraphQL request time to complete
