"use client";

import { Inbox } from '@novu/nextjs';

export default function NovuInbox() {
  return (
    <Inbox
      applicationIdentifier="_L0ovZWrcivr"
      subscriber="69f9702caca4539eeab8f6bc"
      socketUrl="wss://socket.novu.co"
      appearance={{
        variables: {
          colorPrimary: "#DD2450",
          colorForeground: "#0E121B"
        }
      }}
    />
  );
}
