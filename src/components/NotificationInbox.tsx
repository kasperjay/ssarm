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

const fallbackSubscriberId = "69f9702caca4539eeab8f6bc";

export function NotificationInbox({
  subscriberId,
  placement,
  placementOffset,
}: NotificationInboxProps) {
  const applicationIdentifier =
    process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER ?? "pQnsBUs5VGYp";
  const backendUrl = process.env.NEXT_PUBLIC_NOVU_BACKEND_URL;
  const socketUrl = process.env.NEXT_PUBLIC_NOVU_SOCKET_URL;

  return (
    <Inbox
      applicationIdentifier={applicationIdentifier}
      subscriber={subscriberId || fallbackSubscriberId}
      {...(backendUrl ? { backendUrl } : {})}
      {...(socketUrl ? { socketUrl } : {})}
      {...(placement ? { placement } : {})}
      {...(placementOffset ? { placementOffset } : {})}
      appearance={{
        variables: {
          colorBackground: "var(--surface-strong)",
          colorForeground: "var(--foreground)",
          colorPrimary: "var(--accent)",
          colorPrimaryForeground: "var(--background)",
          colorSecondary: "var(--accent-secondary)",
          colorSecondaryForeground: "var(--foreground)",
          colorCounter: "var(--accent)",
          colorCounterForeground: "var(--background)",
          colorNeutral: "rgba(255, 255, 255, 0.12)",
          colorShadow: "rgba(0, 0, 0, 0.55)",
          colorRing: "rgba(0, 242, 255, 0.25)",
          fontSize: "14px",
          borderRadius: "18px",
        },
        elements: {
          bellContainer: {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "rgba(255, 255, 255, 0.42)",
            borderRadius: "18px",
            width: "48px",
            height: "48px",
          },
          bellIcon: {
            color: "currentColor",
          },
          popoverContent: {
            backgroundColor: "rgba(18, 18, 26, 0.96)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.55)",
          },
        },
      }}
    />
  );
}
