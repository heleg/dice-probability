import { useEffect, useState } from "react";
import s from "./App.module.css";
import { DiceResult, rollDice } from "./dice.ts";
import { runSimulation } from "./simulation.ts";
import Die from "./Die.tsx";
import clsx from "clsx";

const countSuccessIndex = ({ length, i }) =>
  Math.floor(length / 2) - length + i + 1;

const App = () => {
  const [result, setResult] = useState<DiceResult>();
  const [diceAmount, setDiceAmount] = useState(2);
  const [difficulty, setDifficulty] = useState(6);
  const [percentage, setPercentage] = useState<string[]>();
  const [precision, setPrecision] = useState(0);

  const roll = () => {
    const result = rollDice({
      diceAmount,
      difficulty: 6,
    });
    setResult(result);
    const { percentage } = runSimulation({
      diceAmount,
      difficulty,
      precision,
      rolls: 1000000,
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
          <span className="label-text">Dice amount</span>
          <input
            type="number"
            min={1}
            max={20}
            step={1}
            value={diceAmount}
            onChange={(e) => setDiceAmount(Number(e.target.value))}
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
            onChange={(e) => setDifficulty(Number(e.target.value))}
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
            onChange={(e) => setPrecision(Number(e.target.value))}
          />
        </label>

        <button
          className="primary-button"
          onClick={roll}
        >
          Roll Dice
        </button>
      </header>

      <div className={s.result}>
        <div>
          <div className={s.fails}>
            <h3 className="heading-3">Fails:</h3>
            <div className={s.fail}>
              {percentage?.[Math.floor(length / 2)]}%
            </div>
          </div>
          <div className={s.probabilities}>
            <div>
              <div>
                {percentage
                  ?.slice(0, Math.floor(length / 2))
                  .map((value, i) => {
                    const rate = countSuccessIndex({ length, i });
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
