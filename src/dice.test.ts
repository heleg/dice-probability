import { describe, test } from "bun:test";
import { rollDice } from "./dice.ts";

describe("rollDie", () => {
  test("should return a number between 1 and 6", () => {
    const result = rollDice({ diceAmount: 1, difficulty: 6 });
    console.log("--- --- --- --- result --- :\n", result);
  });
});
