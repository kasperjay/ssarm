export type InvoiceLineItemInput = {
  description: string;
  quantity: number;
  unitPriceCents: number;
};

export type InvoiceLineItem = InvoiceLineItemInput & {
  amountCents: number;
};

export function parseMoneyToCents(input: string): number {
  const normalized = input.trim();
  if (!/^(\d+)(\.\d{1,2})?$/.test(normalized)) {
    throw new Error("Invalid money format");
  }
  return Math.round(Number(normalized) * 100);
}

export function centsToCurrency(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function normalizeLineItems(items: InvoiceLineItemInput[]): InvoiceLineItem[] {
  if (!items.length) {
    throw new Error("At least one invoice line item is required");
  }

  return items.map((item) => {
    if (!item.description.trim()) {
      throw new Error("Each line item must include a description");
    }
    if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
      throw new Error("Each line item quantity must be greater than zero");
    }
    if (!Number.isFinite(item.unitPriceCents) || item.unitPriceCents < 0) {
      throw new Error("Each line item unit price must be zero or greater");
    }

    return {
      description: item.description.trim(),
      quantity: Math.round(item.quantity * 100) / 100,
      unitPriceCents: Math.round(item.unitPriceCents),
      amountCents: Math.round(item.quantity * item.unitPriceCents),
    };
  });
}

export function calculateInvoiceTotals(
  items: InvoiceLineItemInput[],
  taxCents = 0,
): { lineItems: InvoiceLineItem[]; subtotalCents: number; taxCents: number; totalCents: number } {
  const normalizedItems = normalizeLineItems(items);
  const subtotalCents = normalizedItems.reduce((sum, item) => sum + item.amountCents, 0);
  const safeTaxCents = Math.max(0, Math.round(taxCents));

  return {
    lineItems: normalizedItems,
    subtotalCents,
    taxCents: safeTaxCents,
    totalCents: subtotalCents + safeTaxCents,
  };
}

export function generateInvoiceNumber(projectId: string): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `INV-${y}${m}${d}-${projectId.slice(-6).toUpperCase()}`;
}
