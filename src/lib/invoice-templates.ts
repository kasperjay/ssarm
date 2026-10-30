import { INVOICE_PACKAGE_TEMPLATES as rawTemplates } from "./invoice-templates.js";

export interface InvoicePackageTemplate {
  code: string;
  name: string;
  category: string;
  description: string;
  suggestedPriceCents: number;
  lineItems: {
    description: string;
    quantity: number;
    unitPriceCents: number;
    amountCents: number;
  }[];
}

export const INVOICE_PACKAGE_TEMPLATES = rawTemplates as InvoicePackageTemplate[];
