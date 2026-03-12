import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';

const MAX_CALORIES = 2000;
const DAILY_GOAL = 2000;

export default function FoodIntakeTracker() {
  const { foodEntries, addFoodEntry, deleteFoodEntries, updateFoodEntries } = useHealthData();
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');

    const submitFood = () => {
    if (!food || !calories || calories <= 0 || calories > MAX_CALORIES) {
        alert(`Please enter a valid food item and calories (1-${MAX_CALORIES}).`);
        return;
    }

    const now = new Date();

    const newEntry = {
      id: now.getTime(),
      food: food,
        calories: parseInt(calories, 10),
        time: now.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
        }),
        timestamp: now.toISOString(),
    };

    addFoodEntry(newEntry);

    setFood('');
    setCalories('');
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysFoodEntries = foodEntries.filter(entry => entry.timestamp.startsWith(today));
  const todaysCalories = todaysFoodEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);

    return (
    <div className="p-6 bg-white rounded shadow-md flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold">Food Intake Tracker</h2>
      {/* Calorie Progress Bar */}
      <div className="w-full max-w-sm">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${Math.min((todaysCalories / DAILY_GOAL) * 100, 100)}%` }}
          ></div>
          <p className="text-sm text-gray-600 mt-1">
            {`Today's Calories: ${todaysCalories} / ${DAILY_GOAL} kcal`}
          </p>
        </div>
      </div>

      {/* Food Entry Form */}
      <div className="w-full max-w-sm">
        <input type="text" placeholder="Food Item(s)"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="w-full p-2 border rounded mb-2"
        />
        <input type="number" placeholder="Total Calories"
            value={calories}
            min={0}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full p-2 border rounded mb-2"
        /> 
        <button onClick={submitFood} className="w-full bg-blue-500 text-white p-2 rounded">
          Add Food
        </button>
        </div>
        <div className="w-full max-w-sm">
            {todaysFoodEntries?.map((entry) => (
                <div key={entry.id} className="p-2 border-b">
                    <div className="font-bold">{entry.food}</div>
                    <div>{entry.calories} calories</div>
                    <div className="text-sm text-gray-500">{entry.time}</div>
                    {/*Edit and Delete buttons*/}
                    <button
                        onClick={() => {
                            const newFood = prompt('Edit food item:', entry.food);
                            const newCalories = prompt('Edit calories:', entry.calories);

                            if (newFood !== null && newCalories !== null) {
                            const updated = foodEntries.map(e =>
                                e.id === entry.id
                                ? { ...e, food: newFood, calories: parseInt(newCalories, 10) }
                                : e
                            );

                            updateFoodEntries(updated);
                            }
                        }}
                        className="text-blue-500 text-sm mt-1 mr-2"
                        >
                        Edit
                    </button>
                    <button onClick={() => {deleteFoodEntries(foodEntries.filter(e => e.id !== entry.id))}} className="text-red-500 text-sm mt-1">
                        Delete
                    </button>
                </div>
            ))}
        </div>
    </div>
    );
}   