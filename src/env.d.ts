/// <reference path="../.astro/types.d.ts" />

interface OpinlyIdentity {
  email?: string;
  userId?: string;
  [key: string]: any;
}

interface OpinlyContext {
  externalEventId?: string;
  anonId?: string;
  email?: string;
  [key: string]: any;
}

interface OpinlyTracker {
  anonId?: string;
  identify: (traits: OpinlyIdentity) => void;
  track: (
    eventName: 'purchase' | 'sign_up' | 'generate_lead' | 'add_to_cart' | string,
    properties?: Record<string, any>,
    context?: OpinlyContext
  ) => void;
}

declare global {
  interface Window {
    opinly?: OpinlyTracker;
  }
}

export {};