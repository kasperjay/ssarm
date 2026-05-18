"use client";

import { Inbox } from "@novu/nextjs";

type InboxPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

type InboxPlacementOffset = {
  mainAxis?: number;
  crossAxis?: number;
  alignmentAxis?: number | null;
};

type NotificationInboxProps = {
  subscriberId?: string;
  placement?: InboxPlacement;
  placementOffset?: InboxPlacementOffset;
};

export function NotificationInbox({
  subscriberId,
  placement = "top-end",
  placementOffset,
}: NotificationInboxProps) {
  const applicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER;
  const finalSubscriberId = subscriberId || "69f9702caca4539eeab8f6bc";

  return (
    <Inbox
      applicationIdentifier={applicationIdentifier}
      subscriberId={finalSubscriberId}
      placement={placement}
      placementOffset={placementOffset}
      appearance={{
        baseTheme: "dark",
        variables: {
          colorBackground: "var(--surface-strong)",
          colorForeground: "var(--foreground)",
          colorPrimary: "var(--accent)",
          colorPrimaryForeground: "#000000",
          colorSecondary: "var(--accent-secondary)",
          colorSecondaryForeground: "#ffffff",
          colorNeutral: "var(--border-subtle)",
          colorShadow: "rgba(0, 0, 0, 0.55)",
        },
        elements: {
          bellIcon: {
            color: "var(--foreground)",
          },
        },
      }}
    />
  );
}
