type AnalyticsValue = string | number | boolean | null | undefined;

export type AnalyticsPayload = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

function toSerializablePayload(payload: AnalyticsPayload): Record<string, string | number | boolean | null> {
  const serialized: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;
    serialized[key] = value;
  }
  return serialized;
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return;

  const trimmedName = eventName.trim();
  if (!trimmedName) return;

  const serializedPayload = toSerializablePayload(payload);
  const eventRecord = {
    event: trimmedName,
    event_source: 'hyean-web',
    event_time: new Date().toISOString(),
    ...serializedPayload,
  };

  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  window.dataLayer.push(eventRecord);

  if (typeof window.gtag === 'function') {
    window.gtag('event', trimmedName, serializedPayload);
  }

  window.dispatchEvent(
    new CustomEvent('hyean-analytics-event', {
      detail: eventRecord,
    }),
  );
}

