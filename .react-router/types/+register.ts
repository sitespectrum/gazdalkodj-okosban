import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/local-game/:id": {
    "id": string;
  };
  "/new-local-game": {};
  "/local-games": {};
  "/online-game": {};
  "/temp-game": {};
  "/new-game": {};
};