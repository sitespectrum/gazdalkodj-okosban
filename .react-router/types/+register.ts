import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/online-game/:id": {
    "id": string;
  };
  "/admin-game/:id": {
    "id": string;
  };
  "/local-game/:id": {
    "id": string;
  };
  "/new-local-game": {};
  "/online-games": {};
  "/local-games": {};
  "/admin-list": {};
  "/lobby/:id": {
    "id": string;
  };
  "/temp-game": {};
  "/new-game": {};
};