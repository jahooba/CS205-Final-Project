import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WaterIntakeGraph = ({ entries = [] }) => {
  // Ensure `entries` is always an array
  const data = entries.map((entry, index) => ({
    time: entry.time,
    amount: entry.amount || 0, // Default to 0 if `amount` is missing
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Water Intake</h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center">No water intake data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} name="Water Intake (fl oz)" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WaterIntakeGraph;