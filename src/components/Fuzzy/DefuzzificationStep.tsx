/** @format */

// components/fuzzy/DefuzzificationStep.tsx
import React from "react";
import { useFuzzyCalculationStore } from "@/stores/api/fuzzyCalculationStore";
import { MembershipChart } from "./MembershipChart";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

export const DefuzzificationStep: React.FC = () => {
  const completeFlowData = useFuzzyCalculationStore(
    (state) => state.completeFlowData
  );

  if (!completeFlowData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p className="text-base-content/70">
            No defuzzification data available
          </p>
        </div>
      </div>
    );
  }

  const { step_3_defuzzification, final_output } = completeFlowData;
  const { results, summary } = step_3_defuzzification;

  // Prepare aggregated output chart data
  const aggregatedChartData = results.aggregated_output
    ? results.universe.map((x, index) => ({
        x,
        aggregated: results.aggregated_output?.values[index] || 0,
      }))
    : [];

  // Defuzzification methods comparison
  const defuzzMethods = results.aggregated_output
    ? [
        { method: "Centroid", value: results.aggregated_output.centroid },
        { method: "Bisector", value: results.aggregated_output.bisector },
        { method: "Mean of Max", value: results.aggregated_output.mom },
        { method: "Smallest of Max", value: results.aggregated_output.som },
        { method: "Largest of Max", value: results.aggregated_output.lom },
      ]
    : [];

  // Risk level styling
  const getRiskLevelStyle = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "rendah":
        return "bg-success text-success-content";
      case "sedang-rendah":
        return "bg-info text-info-content";
      case "sedang":
        return "bg-warning text-warning-content";
      case "tinggi":
        return "bg-error text-error-content";
      case "sangat tinggi":
        return "bg-error text-error-content border-2 border-error-focus";
      default:
        return "bg-neutral text-neutral-content";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-base-content mb-2">
          Step 3: Defuzzification
        </h2>
        <p className="text-base-content/70">
          Converting fuzzy output to crisp value and interpretation
        </p>
      </div>

      {/* Final Output Highlight */}
      <div
        className={`card shadow-lg ${getRiskLevelStyle(
          final_output.interpretation.risk_level
        )}`}
      >
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="card-title text-2xl mb-2">
                Final Diagnosis Result
              </h3>
              <p className="text-lg opacity-90">
                {final_output.interpretation.description}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">
                {final_output.crisp_value.toFixed(1)}
              </div>
              <div className="text-lg">
                {final_output.interpretation.percentage}
              </div>
              <div className="badge badge-lg mt-2">
                {final_output.interpretation.risk_level}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-primary text-primary-content rounded-lg">
          <div className="stat-title text-primary-content/70">Crisp Output</div>
          <div className="stat-value text-2xl">
            {summary.crisp_output.toFixed(2)}
          </div>
          <div className="stat-desc text-primary-content/70">
            {results.output_parameter.unit}
          </div>
        </div>

        <div className="stat bg-secondary text-secondary-content rounded-lg">
          <div className="stat-title text-secondary-content/70">Confidence</div>
          <div className="stat-value text-2xl">
            {(summary.confidence_in_output * 100).toFixed(0)}%
          </div>
        </div>

        <div className="stat bg-accent text-accent-content rounded-lg">
          <div className="stat-title text-accent-content/70">Risk Level</div>
          <div className="stat-value text-lg">
            {summary.output_interpretation.risk_level}
          </div>
        </div>

        <div className="stat bg-info text-info-content rounded-lg">
          <div className="stat-title text-info-content/70">Method Used</div>
          <div className="stat-value text-lg capitalize">
            {results.method_used}
          </div>
        </div>
      </div>

      {/* Output Parameter Info */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">
            Output Parameter: {results.output_parameter.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-base-200 p-3 rounded">
              <div className="text-sm font-medium text-base-content/70">
                Range
              </div>
              <div className="text-lg font-bold">
                {results.output_parameter.range.min} -{" "}
                {results.output_parameter.range.max}{" "}
                {results.output_parameter.unit}
              </div>
            </div>
            <div className="bg-base-200 p-3 rounded">
              <div className="text-sm font-medium text-base-content/70">
                Crisp Value
              </div>
              <div className="text-lg font-bold text-primary">
                {results.crisp_output.toFixed(2)}{" "}
                {results.output_parameter.unit}
              </div>
            </div>
            <div className="bg-base-200 p-3 rounded">
              <div className="text-sm font-medium text-base-content/70">
                Position
              </div>
              <div className="text-lg font-bold text-secondary">
                {(
                  ((results.crisp_output - results.output_parameter.range.min) /
                    (results.output_parameter.range.max -
                      results.output_parameter.range.min)) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Output Membership Functions */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <MembershipChart
            title="Output Membership Functions"
            universe={results.universe}
            membershipFunctions={results.membership_functions}
            inputValue={results.crisp_output}
            parameterName={results.output_parameter.name}
            unit={results.output_parameter.unit}
            range={results.output_parameter.range}
          />
        </div>
      </div>

      {/* Aggregated Output Visualization */}
      {results.aggregated_output && aggregatedChartData.length > 0 && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-lg">Aggregated Fuzzy Output</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={aggregatedChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="x"
                    label={{
                      value: `${results.output_parameter.name} (${results.output_parameter.unit})`,
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
                  <Tooltip />

                  {/* Aggregated output area */}
                  <Area
                    type="linear"
                    dataKey="aggregated"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    name="Aggregated Output"
                  />

                  {/* Centroid line */}
                  <ReferenceLine
                    x={results.aggregated_output.centroid}
                    stroke="#ff0000"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    label={{
                      value: `Centroid: ${results.aggregated_output.centroid.toFixed(
                        2
                      )}`,
                      position: "top",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Defuzzification Methods Comparison */}
      {defuzzMethods.length > 0 && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-lg">
              Defuzzification Methods Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Value</th>
                    <th>Difference from Centroid</th>
                    <th>Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {defuzzMethods.map((method) => {
                    const centroidValue =
                      results.aggregated_output?.centroid || 0;
                    const difference = method.value - centroidValue;
                    return (
                      <tr
                        key={method.method}
                        className={
                          method.method === "Centroid" ? "bg-primary/10" : ""
                        }
                      >
                        <td className="font-medium">
                          {method.method}
                          {method.method === "Centroid" && (
                            <span className="badge badge-primary badge-sm ml-2">
                              Used
                            </span>
                          )}
                        </td>
                        <td className="font-bold">{method.value.toFixed(3)}</td>
                        <td
                          className={
                            difference === 0
                              ? "text-primary"
                              : difference > 0
                              ? "text-warning"
                              : "text-info"
                          }
                        >
                          {difference === 0
                            ? "±0.000"
                            : (difference > 0 ? "+" : "") +
                              difference.toFixed(3)}
                        </td>
                        <td>
                          <div className="w-32 bg-base-300 rounded-full h-2 relative">
                            <div
                              className="bg-primary h-2 rounded-full absolute"
                              style={{
                                left: `${
                                  ((method.value -
                                    results.output_parameter.range.min) /
                                    (results.output_parameter.range.max -
                                      results.output_parameter.range.min)) *
                                  100
                                }%`,
                                width: "3px",
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Output Interpretation Details */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">Output Interpretation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dominant Output Sets */}
            <div>
              <h4 className="font-semibold mb-3">Dominant Output Sets</h4>
              <div className="space-y-2">
                {summary.dominant_output_sets.map((set, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-base-200 p-3 rounded"
                  >
                    <span className="font-medium">{set.set_name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-base-300 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${set.membership_degree * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">
                        {(set.membership_degree * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment */}
            <div>
              <h4 className="font-semibold mb-3">Risk Assessment</h4>
              <div className="space-y-3">
                <div className="bg-base-200 p-3 rounded">
                  <div className="text-sm font-medium text-base-content/70">
                    Numeric Value
                  </div>
                  <div className="text-xl font-bold">
                    {summary.output_interpretation.numeric_value}
                  </div>
                </div>
                <div className="bg-base-200 p-3 rounded">
                  <div className="text-sm font-medium text-base-content/70">
                    Percentage
                  </div>
                  <div className="text-xl font-bold">
                    {summary.output_interpretation.percentage}
                  </div>
                </div>
                <div
                  className={`p-3 rounded ${getRiskLevelStyle(
                    summary.output_interpretation.risk_level
                  )}`}
                >
                  <div className="opacity-70 text-sm">Risk Level</div>
                  <div className="text-xl font-bold">
                    {summary.output_interpretation.risk_level}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 p-4 bg-base-200 rounded-lg">
            <h4 className="font-semibold mb-2">Clinical Interpretation</h4>
            <p className="text-base-content/80 leading-relaxed">
              {summary.output_interpretation.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
