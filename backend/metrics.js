// backend/metrics.js
const client = require('prom-client');
const register = new client.Registry();

// Default Node.js metrics (CPU, memory, event loop lag, etc.)
client.collectDefaultMetrics({ register });

// Custom HTTP request counter
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'statusCode'],
});

register.registerMetric(httpRequestCounter);

module.exports = {
  register,
  httpRequestCounter,
};
