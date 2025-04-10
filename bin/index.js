#!/usr/bin/env node

const { Command } = require("commander");
const cache = require("../src/cache");
const startServer = require("../src/server");
const program = new Command();

program
  .option("--port <number>", "Port to run the proxy server")
  .option("--origin <url>", "Origin server to forward requests")
  .option("--clear-cache", "Clear the in-memory cache");

program.parse(process.argv);
const options = program.opts();

if (options.clearCache) {
  cache.clear();
  console.log("🧹 Cache cleared successfully.");
  process.exit(0);
}

if (!options.port || !options.origin) {
  console.error("❌ Both --port and --origin must be provided.");
  process.exit(1);
}

startServer(parseInt(options.port), options.origin);
