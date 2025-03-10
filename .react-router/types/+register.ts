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
  "/temp-game": {};
  "/new-game": {};
};