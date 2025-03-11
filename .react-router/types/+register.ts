import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/local-games": {};
  "/local-game": {};
  "/local-game/:id": {
    "id": string;
  };
  "/temp-game": {};
  "/new-game": {};
};