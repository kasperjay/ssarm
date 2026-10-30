const INVOICE_PACKAGE_TEMPLATES = [
  {
    code: "MIX_SINGLE",
    name: "Standard Mix Package (Single Track)",
    category: "Mixing",
    description: "Full multi-track stereo mixdown with analog hybrid processing and up to 2 revisions.",
    suggestedPriceCents: 25000,
    lineItems: [
      {
        description: "Full Stereo Mixdown (Up to 48 stems, analog summation)",
        quantity: 1,
        unitPriceCents: 20000,
        amountCents: 20000,
      },
      {
        description: "Stem & Performance Mix Bounces (Instrumental, TV, Acapella)",
        quantity: 1,
        unitPriceCents: 5000,
        amountCents: 5000,
      },
    ],
  },
  {
    code: "MASTER_SINGLE",
    name: "Dedicated Mastering (Single Track)",
    category: "Mastering",
    description: "Precision mastering optimized for Apple Digital Masters, Spotify, and club playback (44.1k & 48k WAV + MP3).",
    suggestedPriceCents: 8500,
    lineItems: [
      {
        description: "Stereo Master (24-bit 48kHz & 16-bit 44.1kHz WAV, 320kbps MP3)",
        quantity: 1,
        unitPriceCents: 8500,
        amountCents: 8500,
      },
    ],
  },
  {
    code: "MIX_MASTER_BUNDLE",
    name: "Complete Mix & Master Bundle (Single)",
    category: "Bundles",
    description: "Complete single production: multi-track mixdown, full stem bounces, and final mastering.",
    suggestedPriceCents: 35000,
    lineItems: [
      {
        description: "Single Track Multi-Track Mixdown & Production Polish",
        quantity: 1,
        unitPriceCents: 25000,
        amountCents: 25000,
      },
      {
        description: "Precision Single Mastering (Hi-Res WAV 44.1k/48k + MP3)",
        quantity: 1,
        unitPriceCents: 6000,
        amountCents: 6000,
      },
      {
        description: "Full Track-Outs, Stems & Alternate Bounces Archive",
        quantity: 1,
        unitPriceCents: 4000,
        amountCents: 4000,
      },
    ],
  },
  {
    code: "EP_PACKAGE",
    name: "Full EP Production (5 Tracks)",
    category: "Bundles",
    description: "Complete 5-track EP mixing, cohesive mastering, stem packages, and instrumental versions.",
    suggestedPriceCents: 140000,
    lineItems: [
      {
        description: "5-Track EP Full Stem Mixing & Balance",
        quantity: 5,
        unitPriceCents: 22000,
        amountCents: 110000,
      },
      {
        description: "Cohesive EP Mastering Sequence (Apple Digital Master specs)",
        quantity: 5,
        unitPriceCents: 5000,
        amountCents: 25000,
      },
      {
        description: "Stems, Track Outs & Alt Bounces Archival Delivery",
        quantity: 1,
        unitPriceCents: 5000,
        amountCents: 5000,
      },
    ],
  },
  {
    code: "ALBUM_PACKAGE",
    name: "Full Album Production (10 Tracks)",
    category: "Bundles",
    description: "Complete 10-track full album mixing, DDP mastering, stems, and performance deliverables.",
    suggestedPriceCents: 260000,
    lineItems: [
      {
        description: "10-Track Full Album Mixing",
        quantity: 10,
        unitPriceCents: 21000,
        amountCents: 210000,
      },
      {
        description: "Full Album Mastering & Sequencing",
        quantity: 10,
        unitPriceCents: 4500,
        amountCents: 45000,
      },
      {
        description: "Full Stems, Track-Outs & DDP CD Image Package",
        quantity: 1,
        unitPriceCents: 5000,
        amountCents: 5000,
      },
    ],
  },
  {
    code: "VOCAL_TUNING",
    name: "Vocal Production & Tuning",
    category: "Vocal",
    description: "Lead and backing vocal manual pitch correction (Melodyne), sibilance de-essing, and timing alignment.",
    suggestedPriceCents: 15000,
    lineItems: [
      {
        description: "Manual Melodyne Pitch Correction & Note Shaping",
        quantity: 1,
        unitPriceCents: 9000,
        amountCents: 9000,
      },
      {
        description: "Vocal Comping, Time Alignment & Sibilance Sculpting",
        quantity: 1,
        unitPriceCents: 6000,
        amountCents: 6000,
      },
    ],
  },
];

module.exports = {
  INVOICE_PACKAGE_TEMPLATES,
};
