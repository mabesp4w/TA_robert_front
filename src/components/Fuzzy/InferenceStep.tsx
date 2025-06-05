/** @format */

// components/fuzzy/InferenceStep.tsx
import React from "react";
import { useFuzzyCalculationStore } from "@/stores/api/fuzzyCalculationStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const InferenceStep: React.FC = () => {
  const completeFlowData = useFuzzyCalculationStore(
    (state) => state.completeFlowData
  );

  if (!completeFlowData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p className="text-base-content/70">No inference data available</p>
        </div>
      </div>
    );
  }

  const { step_2_inference } = completeFlowData;
  const { results, summary } = step_2_inference;

  // Prepare data for disease scores chart
  const diseaseChartData = Object.entries(results.diseases_scores).map(
    ([diseaseName, data]) => ({
      disease: diseaseName,
      total_score: data.total_score,
      avg_activation: data.avg_activation,
      rules_count: data.rules_count,
      severity: data.severity,
    })
  );

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 border border-base-300 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(3)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-base-content mb-2">
          Step 2: Fuzzy Inference
        </h2>
        <p className="text-base-content/70">
          Evaluating fuzzy rules and calculating disease probabilities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-primary text-primary-content rounded-lg">
          <div className="stat-title text-primary-content/70">Total Rules</div>
          <div className="stat-value text-2xl">
            {summary.total_rules_evaluated}
          </div>
        </div>

        <div className="stat bg-secondary text-secondary-content rounded-lg">
          <div className="stat-title text-secondary-content/70">
            Activated Rules
          </div>
          <div className="stat-value text-2xl">
            {summary.total_activated_rules}
          </div>
        </div>

        <div className="stat bg-accent text-accent-content rounded-lg">
          <div className="stat-title text-accent-content/70">
            Activation Rate
          </div>
          <div className="stat-value text-2xl">
            {(summary.activation_rate * 100).toFixed(0)}%
          </div>
        </div>

        <div className="stat bg-info text-info-content rounded-lg">
          <div className="stat-title text-info-content/70">Avg Strength</div>
          <div className="stat-value text-2xl">
            {(summary.avg_activation_strength * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Strongest Rule */}
      {summary.strongest_rule && (
        <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-white">Strongest Activated Rule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-primary-content/70 text-sm">Rule Name</div>
                <div className="font-bold text-lg">
                  {summary.strongest_rule.name}
                </div>
              </div>
              <div>
                <div className="text-primary-content/70 text-sm">Disease</div>
                <div className="font-bold text-lg">
                  {summary.strongest_rule.disease}
                </div>
              </div>
              <div>
                <div className="text-primary-content/70 text-sm">
                  Activation Strength
                </div>
                <div className="font-bold text-lg">
                  {(summary.strongest_rule.strength * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disease Scores Chart */}
      {diseaseChartData.length > 0 && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">
              Disease Probability Scores
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={diseaseChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="disease"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    label={{
                      value: "Score",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="total_score"
                    fill="#8884d8"
                    name="Total Score"
                  />
                  <Bar
                    dataKey="avg_activation"
                    fill="#82ca9d"
                    name="Avg Activation"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Top Diseases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disease Ranking */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-lg">Top Diseases Ranking</h3>
            <div className="space-y-3">
              {summary.top_diseases.map((disease, index) => (
                <div
                  key={disease.disease}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index === 0
                      ? "bg-error/10 border border-error/20"
                      : index === 1
                      ? "bg-warning/10 border border-warning/20"
                      : index === 2
                      ? "bg-info/10 border border-info/20"
                      : "bg-base-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`badge ${
                        index === 0
                          ? "badge-error"
                          : index === 1
                          ? "badge-warning"
                          : index === 2
                          ? "badge-info"
                          : "badge-neutral"
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-bold">{disease.disease}</div>
                      <div className="text-sm text-base-content/70">
                        {disease.rules_count} rules, {disease.severity} severity
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {disease.total_score.toFixed(3)}
                    </div>
                    <div className="text-sm text-base-content/70">
                      Avg: {(disease.avg_activation * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disease Distribution Pie Chart */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-lg">Disease Score Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseaseChartData.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ disease, total_score }) =>
                      `${disease}: ${total_score.toFixed(2)}`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total_score"
                  >
                    {diseaseChartData.slice(0, 5).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Activated Rules Details */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">Activated Rules Details</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Rule Name</th>
                  <th>Disease</th>
                  <th>Activation Strength</th>
                  <th>Weight</th>
                  <th>Conditions</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {results.activated_rules.slice(0, 10).map((rule) => (
                  <tr key={rule.rule_id}>
                    <td className="font-medium">{rule.rule_name}</td>
                    <td>
                      <span className="badge badge-outline">
                        {rule.disease}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-base-300 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${rule.activation_strength * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold">
                          {(rule.activation_strength * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="font-mono">{rule.weight.toFixed(2)}</td>
                    <td>
                      <div className="text-xs space-y-1">
                        {rule.conditions.map((condition, condIndex) => (
                          <div key={condIndex} className="flex justify-between">
                            <span>
                              {condition.parameter}: {condition.fuzzy_set}
                            </span>
                            <span className="font-bold">
                              {condition.membership_degree.toFixed(3)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="text-xs text-base-content/70 uppercase">
                      {rule.method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {results.activated_rules.length > 10 && (
            <div className="text-center mt-4">
              <div className="text-sm text-base-content/70">
                Showing top 10 of {results.activated_rules.length} activated
                rules
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
