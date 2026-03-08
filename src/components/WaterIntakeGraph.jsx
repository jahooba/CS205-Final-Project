import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const DAILY_GOAL = 125;

const WaterIntakeGraph = ({ entries = [] }) => {

  let runningTotal = 0;

  const data = entries.map((entry) => {
    runningTotal += entry.amount || 0;

    return {
      time: entry.time,
      total: runningTotal
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">

      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Today's Hydration
      </h3>

      {data.length === 0 ? (
        <p className="text-gray-500 text-center">
          No water intake data available.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />

            <YAxis
              label={{
                value: "Fluid Ounces",
                angle: -90,
                position: "insideLeft"
              }}
            />

            <Tooltip />

            {/* Hydration line */}
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Total Water"
            />

            {/* Daily goal line */}
            <ReferenceLine
              y={DAILY_GOAL}
              stroke="#22c55e"
              strokeDasharray="5 5"
              label="Goal"
            />

          </LineChart>
        </ResponsiveContainer>
      )}

    </div>
  );
};

export default WaterIntakeGraph;