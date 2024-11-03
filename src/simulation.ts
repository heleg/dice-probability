import { fromLength, times } from "withstand";
import { rollDice } from "./dice.ts";

// TODO: use wasm
export const runSimulation = ({
  diceAmount,
  difficulty,
  rolls,
  precision,
}: {
  diceAmount: number;
  difficulty: number;
  rolls: number;
  precision: number;
}) => {
  const result = [
    ...fromLength(diceAmount).map(() => 0),
    0,
    ...fromLength(diceAmount).map(() => 0),
  ];

  times(rolls, () => {
    const roll = rollDice({ diceAmount, difficulty });
    result[roll.total + diceAmount] = result[roll.total + diceAmount] + 1;
  });

  const percentage = result.map((value) => {
    return ((value / rolls) * 100).toFixed(precision);
  });

  return { result, percentage };
};
