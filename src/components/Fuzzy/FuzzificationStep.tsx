/** @format */

// components/fuzzy/FuzzificationStep.tsx
import React from "react";
import { MembershipChart } from "./MembershipChart";
import { useFuzzyCalculationStore } from "@/stores/api/fuzzyCalculationStore";

export const FuzzificationStep: React.FC = () => {
  const completeFlowData = useFuzzyCalculationStore(
    (state) => state.completeFlowData
  );

  if (!completeFlowData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p className="text-base-content/70">
            No fuzzification data available
          </p>
        </div>
      </div>
    );
  }

  const { step_1_fuzzification } = completeFlowData;
  const { results, summary } = step_1_fuzzification;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-base-content mb-2">
          Step 1: Fuzzification
        </h2>
        <p className="text-base-content/70">
          Converting crisp input values to fuzzy membership degrees
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-primary text-primary-content rounded-lg">
          <div className="stat-title text-primary-content/70">
            Total Parameters
          </div>
          <div className="stat-value text-2xl">{summary.total_parameters}</div>
        </div>

        <div className="stat bg-secondary text-secondary-content rounded-lg">
          <div className="stat-title text-secondary-content/70">
            Average Membership
          </div>
          <div className="stat-value text-2xl">
            {(summary.average_membership * 100).toFixed(1)}%
          </div>
        </div>

        <div className="stat bg-accent text-accent-content rounded-lg">
          <div className="stat-title text-accent-content/70">
            High Confidence
          </div>
          <div className="stat-value text-2xl">
            {summary.high_membership_params.length}
          </div>
          <div className="stat-desc text-accent-content/70">params ≥ 70%</div>
        </div>

        <div className="stat bg-warning text-warning-content rounded-lg">
          <div className="stat-title text-warning-content/70">
            Low Confidence
          </div>
          <div className="stat-value text-2xl">
            {summary.low_membership_params.length}
          </div>
          <div className="stat-desc text-warning-content/70">params ≤ 30%</div>
        </div>
      </div>

      {/* Input Data Overview */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">Input Data</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(completeFlowData.input_data).map(
              ([param, value]) => (
                <div key={param} className="bg-base-200 p-3 rounded">
                  <div className="text-sm font-medium text-base-content/70 capitalize">
                    {param.replace(/_/g, " ")}
                  </div>
                  <div className="text-lg font-bold">
                    {typeof value === "number" ? value.toFixed(1) : value}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Fuzzification Results for each Parameter */}
      <div className="space-y-8">
        {Object.entries(results).map(([paramName, paramResult]) => (
          <div key={paramName} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h3 className="card-title text-xl capitalize mb-4">
                {paramName.replace(/_/g, " ")} Fuzzification
              </h3>

              {/* Parameter Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-base-200 p-3 rounded">
                  <div className="text-sm font-medium text-base-content/70">
                    Input Value
                  </div>
                  <div className="text-lg font-bold">
                    {paramResult.input_value} {paramResult.unit}
                  </div>
                </div>

                <div className="bg-base-200 p-3 rounded">
                  <div className="text-sm font-medium text-base-content/70">
                    Dominant Set
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {paramResult.dominant_set}
                  </div>
                </div>

                <div className="bg-base-200 p-3 rounded">
                  <div className="text-sm font-medium text-base-content/70">
                    Max Membership
                  </div>
                  <div className="text-lg font-bold text-secondary">
                    {(paramResult.max_membership_degree * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Membership Chart */}
              <MembershipChart
                title={`${paramName.replace(/_/g, " ")} Membership Functions`}
                universe={paramResult.universe}
                membershipFunctions={paramResult.membership_degrees}
                inputValue={paramResult.input_value}
                parameterName={paramName.replace(/_/g, " ")}
                unit={paramResult.unit}
                range={paramResult.range}
              />

              {/* Membership Degrees Table */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">
                  Membership Degrees
                </h4>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Fuzzy Set</th>
                        <th>Function Type</th>
                        <th>Parameters</th>
                        <th>Membership Degree</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paramResult.membership_degrees.map((md, index) => (
                        <tr key={index}>
                          <td>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: md.color }}
                              />
                              <span className="font-medium">{md.set_name}</span>
                            </div>
                          </td>
                          <td className="capitalize">{md.function_type}</td>
                          <td>
                            <span className="font-mono text-sm">
                              [
                              {md.parameters
                                .map((p) => p.toFixed(1))
                                .join(", ")}
                              ]
                            </span>
                          </td>
                          <td>
                            <span className="font-bold">
                              {md.membership_degree.toFixed(4)}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-base-300 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{
                                    width: `${md.membership_degree * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {(md.membership_degree * 100).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Analysis */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">Fuzzification Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* High Membership Parameters */}
            {summary.high_membership_params.length > 0 && (
              <div>
                <h4 className="font-semibold text-success mb-2">
                  High Confidence Parameters (≥ 70%)
                </h4>
                <div className="space-y-2">
                  {summary.high_membership_params.map((param, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-success/10 p-2 rounded"
                    >
                      <span className="capitalize">
                        {param.parameter.replace(/_/g, " ")}
                      </span>
                      <div className="text-right">
                        <div className="font-bold text-success">
                          {param.set}
                        </div>
                        <div className="text-sm">
                          {(param.degree * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Low Membership Parameters */}
            {summary.low_membership_params.length > 0 && (
              <div>
                <h4 className="font-semibold text-warning mb-2">
                  Low Confidence Parameters (≤ 30%)
                </h4>
                <div className="space-y-2">
                  {summary.low_membership_params.map((param, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-warning/10 p-2 rounded"
                    >
                      <span className="capitalize">
                        {param.parameter.replace(/_/g, " ")}
                      </span>
                      <div className="text-right">
                        <div className="font-bold text-warning">
                          {param.set}
                        </div>
                        <div className="text-sm">
                          {(param.degree * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
