import { describe, test } from "bun:test";
import { runSimulation } from "./simulation.ts";

describe("simulation", () => {
  test.only("should return a number between 1 and 6", () => {
    const result = runSimulation({
      diceAmount: 10,
      difficulty: 4,
      rolls: 1000,
    });
  });
});
