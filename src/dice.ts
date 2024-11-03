// TODO: Add seed random support
import { fromLength } from "withstand";

export const rollDie = () => {
  return Math.floor(Math.random() * 10) + 1;
};

enum Status {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  BOTCH = "BOTCH",
}

export const getStatus = (value: number, difficulty: number) => {
  if (value === 1) {
    return Status.BOTCH;
  }
  return value >= difficulty ? Status.SUCCESS : Status.FAILURE;
};

interface DieResult {
  status: Status;
  value: number;
}

export interface DiceResult {
  results: DieResult[];
  total: number;
}

export const rollDice = ({
  diceAmount,
  difficulty,
}: {
  diceAmount: number;
  difficulty: number;
}): DiceResult => {
  const results = fromLength(diceAmount).map((): DieResult => {
    const result = rollDie();
    return {
      status: getStatus(result, difficulty),
      value: result,
    };
  });

  return {
    results,
    total: results.reduce((sum, { status }) => {
      switch (status) {
        case Status.BOTCH:
          return sum - 1;
        case Status.SUCCESS:
          return sum + 1;
        case Status.FAILURE:
          return sum;
        default:
          throw new Error("Invalid status");
      }
    }, 0),
  };
};
