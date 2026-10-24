export function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<unknown>;

export function getTransporter(): unknown;
