import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { AsyncHooksContextManager } from "@opentelemetry/context-async-hooks";
import { CompositePropagator } from "@opentelemetry/core";
import { W3CBaggagePropagator } from "@opentelemetry/core";
import { W3CTraceContextPropagator } from "@opentelemetry/core";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const resource = resourceFromAttributes({
  [SemanticResourceAttributes.SERVICE_NAME]:
    process.env.SERVICE_NAME || "order-service",
});

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
});

const prometheusExporter = new PrometheusExporter({
  host: "0.0.0.0",
  port: Number(process.env.OTEL_PROM_PORT) || 9464,
  endpoint: "/metrics",
});

const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader: prometheusExporter,
  spanProcessors: [new BatchSpanProcessor(traceExporter)],

  instrumentations: [getNodeAutoInstrumentations()],

  contextManager: new AsyncHooksContextManager().enable(),
  textMapPropagator: new CompositePropagator({
    propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()],
  }),
});

export async function startTelemetry() {
  await sdk.start();
}

export async function stopTelemetry() {
  await sdk.shutdown();
}
