import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import React from "react";

const DevWrapper =
  process.env.NODE_ENV === "development"
    ? ({ children }) => {
        const [mounted] = React.useState(true);
        return mounted ? children : null;
      }
    : ({ children }) => children;

startTransition(() => {
  hydrateRoot(
    document,
    <DevWrapper>
      <HydratedRouter />
    </DevWrapper>
  );
});
