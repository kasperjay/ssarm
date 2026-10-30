const STUDIO_PAYMENT_CONFIG = {
  stripe: {
    enabled: true,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
    applePayEnabled: true,
  },
  paypal: {
    enabled: true,
    meUrl: "https://paypal.me/SpectralSoundworks",
    accountEmail: "billing@spectralsoundworks.com",
  },
  venmo: {
    enabled: true,
    handle: "@SpectralSoundworks",
  },
  chime: {
    enabled: true,
    tag: "$SpectralSoundworks",
    name: "Spectral Soundworks Studio",
  },
};

module.exports = {
  STUDIO_PAYMENT_CONFIG,
};
