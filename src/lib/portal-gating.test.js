const test = require("node:test");
const assert = require("node:assert/strict");
const { INVOICE_PACKAGE_TEMPLATES } = require("./invoice-templates");
const { STUDIO_PAYMENT_CONFIG } = require("./payment-config");

test("Invoice Package Templates: all packages have valid line items and positive pricing", () => {
  assert.ok(INVOICE_PACKAGE_TEMPLATES.length >= 5, "Expected at least 5 standard studio packages");

  const expectedCodes = ["MIX_SINGLE", "MASTER_SINGLE", "MIX_MASTER_BUNDLE", "EP_PACKAGE", "ALBUM_PACKAGE", "VOCAL_TUNING"];
  for (const code of expectedCodes) {
    const pkg = INVOICE_PACKAGE_TEMPLATES.find((t) => t.code === code);
    assert.ok(pkg, `Package with code ${code} must exist`);
    assert.ok(pkg.name && pkg.name.length > 0, "Package must have a name");
    assert.ok(pkg.suggestedPriceCents > 0, "Price must be positive");
    assert.ok(Array.isArray(pkg.lineItems) && pkg.lineItems.length > 0, "Package must contain line items");

    const sum = pkg.lineItems.reduce((acc, item) => acc + item.amountCents, 0);
    assert.equal(sum, pkg.suggestedPriceCents, `Sum of line items must equal suggestedPriceCents for ${code}`);
  }
});

test("Studio Payment Config: supports Stripe, Apple Pay, PayPal, Venmo, and Chime", () => {
  assert.ok(STUDIO_PAYMENT_CONFIG.stripe.enabled, "Stripe must be enabled");
  assert.ok(STUDIO_PAYMENT_CONFIG.stripe.applePayEnabled, "Apple Pay must be enabled");
  assert.ok(STUDIO_PAYMENT_CONFIG.paypal.enabled, "PayPal must be enabled");
  assert.ok(STUDIO_PAYMENT_CONFIG.paypal.meUrl.includes("paypal.me"), "PayPal ME URL must be configured");
  assert.ok(STUDIO_PAYMENT_CONFIG.venmo.enabled, "Venmo must be enabled");
  assert.ok(STUDIO_PAYMENT_CONFIG.venmo.handle.startsWith("@"), "Venmo handle must start with @");
  assert.ok(STUDIO_PAYMENT_CONFIG.chime.enabled, "Chime must be enabled");
  assert.ok(STUDIO_PAYMENT_CONFIG.chime.tag.startsWith("$"), "Chime tag must start with $");
});

test("Deliverables Dual-Gating Authorization Logic", () => {
  function checkDeliverableAccess({
    fileType,
    paywallDeliverables,
    invoicePaid,
    invoiceTotalCents,
    rating,
  }) {
    if (fileType !== "DELIVERABLE") {
      return { allowed: true };
    }

    // Gate 1: Paywall check
    if (paywallDeliverables && invoiceTotalCents > 0 && !invoicePaid) {
      return { allowed: false, reason: "PAYWALL_LOCKED" };
    }

    // Gate 2: Mandatory feedback / rating check (0-5 stars)
    if (rating === null || rating === undefined || rating < 0 || rating > 5) {
      return { allowed: false, reason: "RATING_LOCKED" };
    }

    return { allowed: true };
  }

  // Working bounces are always accessible
  assert.deepEqual(
    checkDeliverableAccess({
      fileType: "WORKING",
      paywallDeliverables: true,
      invoicePaid: false,
      invoiceTotalCents: 50000,
      rating: null,
    }),
    { allowed: true },
    "Working files should not be gated by deliverable locks"
  );

  // Deliverables with unpaid paywall must be locked
  assert.deepEqual(
    checkDeliverableAccess({
      fileType: "DELIVERABLE",
      paywallDeliverables: true,
      invoicePaid: false,
      invoiceTotalCents: 35000,
      rating: 5,
    }),
    { allowed: false, reason: "PAYWALL_LOCKED" },
    "Deliverable must be blocked when invoice is unpaid and paywall is on"
  );

  // Deliverables with paywall disabled, but no rating must be locked
  assert.deepEqual(
    checkDeliverableAccess({
      fileType: "DELIVERABLE",
      paywallDeliverables: false,
      invoicePaid: false,
      invoiceTotalCents: 35000,
      rating: null,
    }),
    { allowed: false, reason: "RATING_LOCKED" },
    "Deliverable must be blocked when rating is not submitted even if paywall is off"
  );

  // Deliverables with both invoice paid and rating submitted must be allowed
  assert.deepEqual(
    checkDeliverableAccess({
      fileType: "DELIVERABLE",
      paywallDeliverables: true,
      invoicePaid: true,
      invoiceTotalCents: 35000,
      rating: 5,
    }),
    { allowed: true },
    "Deliverable must be accessible when paid and rated"
  );

  // Deliverables with rating of 0 stars must be allowed (user explicitly gave rating)
  assert.deepEqual(
    checkDeliverableAccess({
      fileType: "DELIVERABLE",
      paywallDeliverables: true,
      invoicePaid: true,
      invoiceTotalCents: 35000,
      rating: 0,
    }),
    { allowed: true },
    "0-star rating satisfies mandatory rating gate"
  );
});

test("Audio Format & Sample Rate Parameter Mapping", () => {
  function getDeliverableTarget({ format, sampleRate, originalName }) {
    const validFormats = ["wav", "mp3"];
    const targetFmt = validFormats.includes(format?.toLowerCase()) ? format.toLowerCase() : "wav";
    const targetRate = sampleRate === 48000 ? 48000 : 44100;
    const base = originalName.replace(/\.[^/.]+$/, "");
    return {
      filename: `${base}_${targetRate / 1000}k.${targetFmt}`,
      format: targetFmt,
      sampleRate: targetRate,
      contentType: targetFmt === "mp3" ? "audio/mpeg" : "audio/wav",
    };
  }

  const res1 = getDeliverableTarget({ format: "wav", sampleRate: 48000, originalName: "Song_Master.wav" });
  assert.equal(res1.filename, "Song_Master_48k.wav");
  assert.equal(res1.contentType, "audio/wav");

  const res2 = getDeliverableTarget({ format: "mp3", sampleRate: 44100, originalName: "Track_01_Vocals.wav" });
  assert.equal(res2.filename, "Track_01_Vocals_44.1k.mp3");
  assert.equal(res2.contentType, "audio/mpeg");
});
