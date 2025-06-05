/** @format */

// components/fuzzy/MembershipChart.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface MembershipFunction {
  set_name: string;
  function_type: string;
  parameters: number[];
  membership_degree: number;
  color: string;
  function_values: number[];
}

interface MembershipChartProps {
  title: string;
  universe: number[];
  membershipFunctions: MembershipFunction[];
  inputValue?: number;
  parameterName: string;
  unit?: string;
  range: {
    min: number;
    max: number;
  };
}

export const MembershipChart: React.FC<MembershipChartProps> = ({
  title,
  universe,
  membershipFunctions,
  inputValue,
  parameterName,
  unit = "",
  range,
}) => {
  // Prepare data for chart
  const chartData = universe.map((x, index) => {
    const point: any = { x };

    membershipFunctions.forEach((mf) => {
      if (mf.function_values && mf.function_values[index] !== undefined) {
        point[mf.set_name] = mf.function_values[index];
      }
    });

    return point;
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 border border-base-300 rounded-lg shadow-lg">
          <p className="font-semibold">{`${parameterName}: ${label}${
            unit ? " " + unit : ""
          }`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toFixed(3)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-base-content">{title}</h4>
        <p className="text-sm text-base-content/70">
          Range: {range.min}
          {unit} - {range.max}
          {unit}
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="x"
              type="number"
              scale="linear"
              domain={["dataMin", "dataMax"]}
              label={{
                value: `${parameterName}${unit ? " (" + unit + ")" : ""}`,
                position: "insideBottom",
                offset: -10,
              }}
            />
            <YAxis
              domain={[0, 1]}
              label={{
                value: "Membership Degree",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Input value reference line */}
            {inputValue !== undefined && (
              <ReferenceLine
                x={inputValue}
                stroke="#ff0000"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: `Input: ${inputValue}`, position: "top" }}
              />
            )}

            {/* Render membership function lines */}
            {membershipFunctions.map((mf) => (
              <Line
                key={mf.set_name}
                type="linear"
                dataKey={mf.set_name}
                stroke={mf.color}
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Membership degrees for input value */}
      {inputValue !== undefined && (
        <div className="mt-4">
          <h5 className="text-md font-medium mb-2">
            Membership Degrees for Input Value: {inputValue}
            {unit}
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {membershipFunctions.map((mf) => (
              <div
                key={mf.set_name}
                className="flex items-center justify-between p-2 bg-base-200 rounded"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: mf.color }}
                  />
                  <span className="text-sm font-medium">{mf.set_name}</span>
                </div>
                <span className="text-sm font-bold">
                  {mf.membership_degree}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
