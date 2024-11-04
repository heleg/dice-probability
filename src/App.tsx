import { useEffect, useState } from "react";
import s from "./App.module.css";
import { DiceResult, rollDice } from "./dice.ts";
import { runSimulation } from "./simulation.ts";
import Die from "./Die.tsx";
import clsx from "clsx";

const ROLLS = 1000000;
const MAX_DICE = 20;

const clamp = (num: number, min: number, max: number) =>
  Math.round(Math.min(Math.max(num, min), max));

const countSuccessIndex = ({ length, i }: { length: number; i: number }) =>
  Math.floor(length / 2) - length + i + 1;

const App = () => {
  const [result, setResult] = useState<DiceResult>();
  const [diceAmount, setDiceAmount] = useState(2);
  const [difficulty, setDifficulty] = useState(6);
  const [percentage, setPercentage] = useState<string[]>();
  const [precision, setPrecision] = useState(0);

  const roll = () => {
    const realDiceAmount = clamp(Number(diceAmount), 1, MAX_DICE);
    const realDifficulty = clamp(Number(difficulty), 3, 10);
    const realPrecision = clamp(Number(precision), 0, 4);

    setPrecision(realPrecision);
    setDifficulty(realDifficulty);
    setDiceAmount(realDiceAmount);

    const result = rollDice({
      diceAmount: realDiceAmount,
      difficulty: realDifficulty,
    });
    setResult(result);

    const { percentage } = runSimulation({
      diceAmount: realDiceAmount,
      difficulty: realDifficulty,
      precision: realPrecision,
      rolls: ROLLS,
    });

    setPercentage(percentage);
  };

  useEffect(() => {
    roll();
  }, []);

  const length = percentage?.length ?? 0;

  return (
    <div className={s.container}>
      <header className={s.header}>
        <h1 className="heading-1">Dice probability</h1>
        <label>
          <span className="label-text">Dice amount (max: {MAX_DICE}) </span>
          <input
            type="number"
            min={1}
            max={MAX_DICE}
            step={1}
            value={diceAmount}
            onChange={(e) => {
              const value = Number(e.target.value);
              return setDiceAmount(value);
            }}
          />
        </label>
        <label>
          <span className="label-text">Difficulty</span>
          <input
            type="number"
            min={3}
            max={10}
            step={1}
            value={difficulty}
            onChange={(e) => {
              const value = Number(e.target.value);
              return setDifficulty(value);
            }}
          />
        </label>

        <label>
          <span className="label-text">Precision</span>
          <input
            type="number"
            min={0}
            max={4}
            step={1}
            value={precision}
            onChange={(e) => {
              const value = Number(e.target.value);
              return setPrecision(value);
            }}
          />
        </label>

        <button
          className="primary-button"
          onClick={roll}
        >
          Roll Dice ({ROLLS} times)
        </button>
      </header>

      <div className={s.result}>
        <div>
          <div className={s.stats}>
            <div className={clsx(s.stat, s.botch)}>
              {percentage
                ?.slice(0, Math.floor(length / 2))
                .reduce((acc, value) => acc + Number(value), 0)
                .toFixed(precision)}
              %
            </div>
            <div className={clsx(s.stat, s.failure)}>
              {percentage &&
                Number(percentage[Math.floor(length / 2)]).toFixed(precision)}
              %
            </div>
            <div className={clsx(s.stat, s.success)}>
              {percentage
                ?.slice(Math.floor(length / 2) + 1)
                .reduce((acc, value) => acc + Number(value), 0)
                .toFixed(precision)}
              %
            </div>
          </div>
          <div className={s.probabilities}>
            <div>
              <div>
                {percentage
                  ?.slice(0, Math.floor(length / 2))
                  .reverse()
                  .map((value, i) => {
                    const rate = countSuccessIndex({
                      length,
                      i: Math.floor(length / 2) - i - 1,
                    });
                    return (
                      <div key={i}>
                        <span className={clsx(s.rate, s.failure)}>{rate} </span>
                        <span className={s.rateValue}>{value}%</span>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div>
              <div>
                {percentage
                  ?.slice(Math.floor(length / 2) + 1)
                  .map((value, i) => {
                    const rate = countSuccessIndex({
                      length,
                      i: Math.floor(length / 2) + i + 1,
                    });
                    return (
                      <div key={i}>
                        <span className={clsx(s.rate, s.success)}>+{rate}</span>
                        <span className={s.rateValue}>{value}%</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className={s.rolls}>
          {result?.results.map((dieResult, i) => (
            <Die key={i}>{dieResult.value}</Die>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
