import React, { useState, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import { motion } from 'framer-motion';

const WaterIntakeTracker = () => {
  const FL_OZ_TO_ML = 29.5735; // Conversion factor
  const DAILY_GOAL_FL_OZ = 125; // Recommended daily goal in fluid ounces (approx. 3700 mL)

  const [intake, setIntake] = useState(0); // Current water intake in fluid ounces
  const [dragY, setDragY] = useState(0); // Drag position

  // Load saved intake from localStorage
  useEffect(() => {
    const savedIntake = localStorage.getItem('waterIntake');
    if (savedIntake) {
      setIntake(parseFloat(savedIntake)); // Parse as float for fluid ounces
    }
  }, []);

  // Save intake to localStorage
  useEffect(() => {
    localStorage.setItem('waterIntake', intake.toFixed(1)); // Save as string with 1 decimal
  }, [intake]);

  // Handle drag gesture
  const bind = useDrag(({ offset: [, y], last }) => {
    const containerHeight = 256; // Height of the water container in pixels
    const newLevel = Math.max(0, Math.min(DAILY_GOAL_FL_OZ, intake + ((-y / containerHeight) * DAILY_GOAL_FL_OZ)));

    if (last) {
      // On drag release, update the intake
      setIntake(newLevel);
    } else {
      // Update drag position for animation
      setDragY(y);
    }
  });

  const progress = (intake / DAILY_GOAL_FL_OZ) * 100; // Progress percentage

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Water Intake Tracker</h2>
      <div
        className="relative w-full h-64 bg-blue-100 rounded overflow-hidden"
        onClick={(e) => {
          const container = e.currentTarget;
          const containerHeight = container.offsetHeight; // Get the height of the container
          const clickY = e.nativeEvent.offsetY; // Get the Y position of the click relative to the container
          const newIntake = Math.max(
            0,
            Math.min(DAILY_GOAL_FL_OZ, DAILY_GOAL_FL_OZ * (1 - clickY / containerHeight)) // Calculate intake based on click position
          );
          setIntake(newIntake); // Update the intake
        }}
      >
        {/* Water Level */}
        <motion.div
          {...bind()} // Bind drag gesture
          className="absolute bottom-0 left-0 w-full bg-blue-500"
          style={{
            height: `${progress}%`,
          }}
          animate={{
            y: dragY, // Animate based on drag position
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
        />
      </div>
      <p className="mt-4 text-center">
        {intake.toFixed(1)} fl oz / {DAILY_GOAL_FL_OZ} fl oz
      </p>
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setIntake((prev) => Math.min(prev + 8, DAILY_GOAL_FL_OZ))} // Add 8 fl oz
        >
          +8 fl oz
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setIntake(0)} // Reset intake
        >
          Reset
        </button>
      </div>
      {/* Progress Ring */}
      <div className="mt-6 flex justify-center">
        <svg width="100" height="100" viewBox="0 0 36 36" className="progress-ring">
          <circle
            className="progress-ring__background"
            stroke="#e6e6e6"
            strokeWidth="2"
            fill="transparent"
            r="16"
            cx="18"
            cy="18"
          />
          <motion.circle
            className="progress-ring__progress"
            stroke="#4f46e5"
            strokeWidth="2"
            fill="transparent"
            r="16"
            cx="18"
            cy="18"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 100 - progress }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>
    </div>
  );
};

export default WaterIntakeTracker;