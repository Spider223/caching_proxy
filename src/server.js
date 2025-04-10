const express = require("express");
const axios = require("axios");
const cache = require("./cache");

function startServer(port, origin) {
  const app = express();
  const ORIGIN = origin.replace(/\/$/, "");

  app.use(async (req, res) => {
    const url = `${ORIGIN}${req.url}`;
    console.log("url", url);

    if (cache.has(url)) {
      const cached = cache.get(url);
      res.set(cached.headers);
      res.set("X-Cache", "HIT");
      return res.status(cached.status).send(cached.data);
    }

    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer", // supports binary and text
      });

      const responseToCache = {
        status: response.status,
        headers: response.headers,
        data: response.data,
      };

      cache.set(url, responseToCache);

      res.set(response.headers);
      res.set("X-Cache", "Miss");
      res.status(response.status).send(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).send(error.message);
    }
  });

  app.listen(port, () => {
    console.log(`🚀 Caching proxy started on http://localhost:${port}`);
    console.log(`🔁 Forwarding requests to: ${ORIGIN}`);
  });
}

module.exports = startServer;
