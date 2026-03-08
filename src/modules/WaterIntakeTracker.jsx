import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTodayFormatted } from '../utils/helpers';

const WaterIntakeTracker = ({ entries, setEntries }) => {
  const DAILY_GOAL_FL_OZ = 125; // Daily goal in fluid ounces
  const STANDARD_DRINK = 8; // Standard drink size in fluid ounces

  const [intake, setIntake] = useState(0); // Total water intake for the day
  const [today, setToday] = useState(getTodayFormatted()); // Track the current day

  // Load saved data from localStorage
  useEffect(() => {
    const savedIntake = localStorage.getItem('waterIntake');
    const savedEntries = localStorage.getItem('waterEntries');
    const savedDate = localStorage.getItem('waterIntakeDate');

    if (savedDate === getTodayFormatted()) {
      if (savedIntake) setIntake(parseFloat(savedIntake));
      if (savedEntries) setEntries(JSON.parse(savedEntries));
    } else {
      // Reset if the day has changed
      resetTracker();
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('waterIntake', intake.toFixed(1));
    localStorage.setItem('waterEntries', JSON.stringify(entries));
    localStorage.setItem('waterIntakeDate', today);
  }, [intake, entries, today]);

  // Handle adding water intake
  const handleAddWater = () => {
    const now = new Date();
    const newEntry = {
      amount: STANDARD_DRINK,
      timestamp: now.toISOString(),
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };

    setIntake((prev) => Math.min(prev + STANDARD_DRINK, DAILY_GOAL_FL_OZ));
    setEntries((prev) => [...prev, newEntry]);
  };

  // Reset the tracker
  const resetTracker = () => {
    setIntake(0);
    setEntries([]);
    setToday(getTodayFormatted());
    localStorage.removeItem('waterIntake');
    localStorage.removeItem('waterEntries');
    localStorage.removeItem('waterIntakeDate');
  };

  const progress = (intake / DAILY_GOAL_FL_OZ) * 100;

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Water Intake Tracker</h2>
      <div className="flex flex-col items-center">
        {/* Progress Bar */}
        <div className="w-full h-6 bg-blue-100 rounded overflow-hidden mb-4">
          <motion.div
            className="h-full bg-blue-500"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-lg font-semibold mb-4">
          {intake.toFixed(1)} fl oz / {DAILY_GOAL_FL_OZ} fl oz
        </p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
          onClick={handleAddWater}
          disabled={intake >= DAILY_GOAL_FL_OZ}
        >
          +8 fl oz
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={resetTracker}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default WaterIntakeTracker;