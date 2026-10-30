import { STUDIO_PAYMENT_CONFIG as rawConfig } from "./payment-config.js";

export interface PaymentRailConfig {
  stripe: {
    enabled: boolean;
    publishableKey?: string;
    applePayEnabled: boolean;
  };
  paypal: {
    enabled: boolean;
    meUrl: string;
    accountEmail: string;
  };
  venmo: {
    enabled: boolean;
    handle: string;
    qrUrl?: string;
  };
  chime: {
    enabled: boolean;
    tag: string;
    name: string;
  };
}

export const STUDIO_PAYMENT_CONFIG = rawConfig as PaymentRailConfig;
