import React, { useState } from "react";
import { useHealthData } from "../context/HealthDataContext";

const MAX_DRINK = 8;
const DAILY_GOAL = 125;

export default function WaterBottleTracker() {

  const { waterEntries, addWaterEntry } = useHealthData();
  const [amount, setAmount] = useState(0);

  const addWater = (value) => {
    setAmount((prev) => Math.min(prev + value, MAX_DRINK));
  };

  const resetDrink = () => {
    setAmount(0);
  };

  const submitDrink = () => {
    if (amount === 0) return;

    const now = new Date();

    const newEntry = {
      id: now.getTime(),
      amount: amount,
      time: now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      }),
      timestamp: now.toISOString()
    };

    addWaterEntry(newEntry);

    setAmount(0);
  };

  const drinkProgress = (amount / MAX_DRINK) * 100;

  const today = new Date().toISOString().split('T')[0];
  const todaysWaterEntries = waterEntries.filter(entry => entry.timestamp.startsWith(today));
  const total = todaysWaterEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const goalProgress = Math.min(total / DAILY_GOAL, 1);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - goalProgress * circumference;

  return (
    <div className="p-6 bg-white rounded shadow-md flex flex-col items-center gap-6">

      <h2 className="text-xl font-bold">
        Water Intake Tracker
      </h2>
      <p>Track the amount of water you drink and meet your daily goal in fluid ounces. You can add water by sips (1 oz.), gulps (4 oz.), or full drinks (8 oz.) and reset the bottle if needed. </p>

      {/* Hydration Ring */}

      <div className="flex flex-col items-center">

        <svg width="180" height="180">

          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />

          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#3b82f6"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
          />

          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-lg font-bold"
          >
            {total} oz
          </text>

        </svg>

        <p className="text-gray-600 mt-2">
          {Math.round(goalProgress * 100)}% of {DAILY_GOAL} oz goal
        </p>

      </div>

      {/* Bottle */}

      <div className="flex flex-col items-center">

        <div className="relative w-24 h-72 border-4 border-blue-400 rounded-b-3xl rounded-t-xl overflow-hidden">

          <div
            className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-300 transition-all duration-300"
            style={{ height: `${drinkProgress}%` }}
          />

        </div>

        <p className="mt-3 font-semibold">
          {amount} / {MAX_DRINK} oz
        </p>

      </div>

      {/* Buttons */}

      <div className="flex gap-3">

        <button
          className="px-3 py-1 bg-blue-400 text-white rounded"
          onClick={() => addWater(1)}
        >
          Sip (1 oz)
        </button>

        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => addWater(4)}
        >
          Gulp (4 oz)
        </button>

        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => addWater(8)}
        >
          Drink (8 oz)
        </button>

      </div>

      {/* Controls */}

      <div className="flex gap-3">

        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={submitDrink}
          disabled={amount === 0}
        >
          Submit Drink
        </button>

        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={resetDrink}
          disabled={amount === 0}
        >
          Reset
        </button>

      </div>

    </div>
  );
}