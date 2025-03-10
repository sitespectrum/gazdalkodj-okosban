import "@/app.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { Providers } from "./lib/providers";
import { useEffect } from "react";
import { useAlert } from "./hooks/use-alert";

/**
 * @type {import("react-router").LinksFunction}
 */
export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "icon",
    href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💸</text></svg>",
  },
];

/**
 * @type {import("react-router").MetaFunction}
 */
export const meta = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  { title: "Gazdálkodj Okosban" },
];

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function Layout({ children }) {
  return (
    <html lang="hu">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (
      !location.pathname.startsWith("/local-game/") &&
      !location.pathname.startsWith("/temp-game")
    ) {
      document.documentElement.style.fontSize = "16px";
    }
  }, [location]);

  return <Outlet />;
}

export function HydrateFallback() {
  return <></>;
}
