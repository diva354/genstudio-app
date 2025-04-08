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

// Custom response time histogram
const httpResponseTimeHistogram = new client.Histogram({
    name: 'http_response_time_seconds',
    help: 'Response time in seconds',
    labelNames: ['method', 'route', 'statusCode'],
    buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5] // Customize as needed
  });

  
//  Register both metrics
register.registerMetric(httpRequestCounter);
register.registerMetric(httpResponseTimeHistogram);

module.exports = {
  register,
  httpRequestCounter,
  httpResponseTimeHistogram
};
