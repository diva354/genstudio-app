// backend/tracing.js
'use strict';

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://grafana-agent:4318/v1/traces', // URL matches your agent's OTLP endpoint
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

(async () => {
    try {
      await sdk.start();
      console.log('✅ Tracing initialized');
    } catch (error) {
      console.error('❌ Failed to start OpenTelemetry SDK:', error);
    }
  })();
