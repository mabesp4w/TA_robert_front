/** @format */

// types/fuzzy.ts
export interface FuzzificationResult {
  parameter_name: string;
  input_value: number;
  unit: string;
  range: {
    min: number;
    max: number;
  };
  membership_degrees: MembershipDegree[];
  dominant_set: string;
  max_membership_degree: number;
  universe: number[];
}

export interface MembershipDegree {
  set_name: string;
  function_type: "trimf" | "trapmf" | "gaussmf";
  parameters: number[];
  membership_degree: number;
  color: string;
  function_values: number[];
}

export interface InferenceResult {
  activated_rules: ActivatedRule[];
  diseases_scores: Record<string, DiseaseScore>;
  total_activated_rules: number;
}

export interface ActivatedRule {
  rule_id: string;
  rule_name: string;
  disease: string;
  conditions: RuleCondition[];
  activation_strength: number;
  weight: number;
  consequent: any;
  method: string;
}

export interface RuleCondition {
  parameter: string;
  fuzzy_set: string;
  input_value: number;
  membership_degree: number;
}

export interface DiseaseScore {
  disease_id: string;
  nm_penyakit?: string;
  deskripsi?: string;
  tingkat_bahaya?: string;
  gejala_umum?: string;
  pengobatan?: string;
  pencegahan?: string;
  total_score: number;
  rules_count: number;
  max_activation: number;
  avg_activation: number;
  severity: "ringan" | "sedang" | "berat" | "sangat_berat";
}

export interface DefuzzificationResult {
  output_parameter: {
    name: string;
    range: {
      min: number;
      max: number;
    };
    unit: string;
  };
  crisp_output: number;
  universe: number[];
  membership_functions: OutputMembershipFunction[];
  crisp_output_memberships: {
    set_name: string;
    membership_degree: number;
  }[];
  method_used: string;
  aggregated_output: AggregatedOutput | null;
}

export interface OutputMembershipFunction {
  set_name: string;
  function_type: "trimf" | "trapmf" | "gaussmf";
  parameters: number[];
  function_values: number[];
  color: string;
  crisp_membership: number;
}

export interface AggregatedOutput {
  values: number[];
  centroid: number;
  bisector: number;
  mom: number; // mean of maximum
  som: number; // smallest of maximum
  lom: number; // largest of maximum
}

export interface FuzzificationSummary {
  total_parameters: number;
  dominant_sets: Record<
    string,
    {
      set_name: string;
      membership_degree: number;
    }
  >;
  average_membership: number;
  high_membership_params: {
    parameter: string;
    set: string;
    degree: number;
  }[];
  low_membership_params: {
    parameter: string;
    set: string;
    degree: number;
  }[];
}

export interface InferenceSummary {
  total_rules_evaluated: number;
  total_activated_rules: number;
  activation_rate: number;
  strongest_rule: {
    name: string;
    disease: string;
    strength: number;
  } | null;
  top_diseases: {
    disease: string;
    total_score: number;
    avg_activation: number;
    rules_count: number;
    severity: string;
  }[];
  avg_activation_strength: number;
}

export interface DefuzzificationSummary {
  crisp_output: number;
  output_interpretation: OutputInterpretation;
  dominant_output_sets: {
    set_name: string;
    membership_degree: number;
  }[];
  defuzzification_methods: Record<string, number>;
  confidence_in_output: number;
}

export interface OutputInterpretation {
  numeric_value: number;
  percentage: string;
  risk_level:
    | "Rendah"
    | "Sedang-Rendah"
    | "Sedang"
    | "Tinggi"
    | "Sangat Tinggi";
  description: string;
}

export interface CompleteFlowData {
  input_data: InputData;
  step_1_fuzzification: {
    results: Record<string, FuzzificationResult>;
    summary: FuzzificationSummary;
  };
  step_2_inference: {
    results: InferenceResult;
    summary: InferenceSummary;
  };
  step_3_defuzzification: {
    results: DefuzzificationResult;
    summary: DefuzzificationSummary;
  };
  final_output: {
    crisp_value: number;
    interpretation: OutputInterpretation;
  };
}

export interface InputData {
  suhu_tubuh: number;
  nafsu_makan: number;
  aktivitas: number;
  frekuensi_napas: number;
  denyut_jantung: number;
  kondisi_mata: number;
  kondisi_hidung: number;
  konsistensi_feses: number;
  produksi_susu: number;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface CalculationRequest {
  pemeriksaan_id?: string;
  manual_inputs?: Partial<InputData>;
}

// Chart Data Types
export interface ChartDataPoint {
  x: number;
  [key: string]: number;
}

export interface MembershipChartProps {
  title: string;
  universe: number[];
  membershipFunctions: MembershipDegree[] | OutputMembershipFunction[];
  inputValue?: number;
  parameterName: string;
  unit?: string;
  range: {
    min: number;
    max: number;
  };
}

// Store Types
export interface FuzzyCalculationState {
  completeFlowData: CompleteFlowData | null;
  inputData: Partial<InputData>;
  pemeriksaanId: string | null;
  loading: boolean;
  error: string | null;
  currentStep: number;

  // Actions
  setInputData: (data: Partial<InputData>) => void;
  setPemeriksaanId: (id: string | null) => void;
  setCurrentStep: (step: number) => void;
  calculateCompleteFlow: () => Promise<void>;
  resetCalculation: () => void;
}

// Form Types
export interface ManualInputForm {
  suhu_tubuh: number;
  nafsu_makan: number;
  aktivitas: number;
  frekuensi_napas: number;
  denyut_jantung: number;
  kondisi_mata: number;
  kondisi_hidung: number;
  konsistensi_feses: number;
  produksi_susu: number;
}

// Utility Types
export type InputMode = "manual" | "pemeriksaan";
export type CalculationStep = 1 | 2 | 3;
export type FunctionType = "trimf" | "trapmf" | "gaussmf";
export type DefuzzificationMethod =
  | "centroid"
  | "bisector"
  | "mom"
  | "som"
  | "lom";

// Constants
export const RISK_LEVELS = {
  RENDAH: "Rendah",
  SEDANG_RENDAH: "Sedang-Rendah",
  SEDANG: "Sedang",
  TINGGI: "Tinggi",
  SANGAT_TINGGI: "Sangat Tinggi",
} as const;

export const PARAMETER_RANGES = {
  suhu_tubuh: { min: 35, max: 45, unit: "°C" },
  nafsu_makan: { min: 0, max: 10, unit: "" },
  aktivitas: { min: 0, max: 10, unit: "" },
  frekuensi_napas: { min: 10, max: 60, unit: "/menit" },
  denyut_jantung: { min: 40, max: 120, unit: "/menit" },
  kondisi_mata: { min: 0, max: 10, unit: "" },
  kondisi_hidung: { min: 0, max: 10, unit: "" },
  konsistensi_feses: { min: 0, max: 10, unit: "" },
  produksi_susu: { min: 0, max: 50, unit: "L/hari" },
} as const;

export interface ParameterFuzzy {
  id?: string;
  nama_parameter: string;
  tipe: "input" | "output";
  satuan?: string;
  nilai_min: number;
  nilai_max: number;
  deskripsi?: string;
  aktif: boolean;
  created_at?: string;
  range_display?: string;
}

export interface ParameterFuzzyChoice {
  id: string;
  nama_parameter: string;
  tipe: string;
}

export interface FungsiKeanggotaan {
  id?: string;
  parameter: string; // ID parameter
  nama_himpunan: string;
  tipe_fungsi: "trimf" | "trapmf" | "gaussmf";
  parameter_fungsi: number[];
  warna: string;
  aktif: boolean;
  created_at?: string;
  parameter_nama?: string;
  parameter_tipe?: string;
  parameter_fungsi_display?: string;
  parameter_detail?: {
    nama: string;
    tipe: string;
    satuan: string;
    range: string;
  };
}

export interface AturanFuzzy {
  id?: string;
  nama_aturan: string;
  penyakit: string; // ID penyakit
  kondisi_if: Record<string, string>;
  kesimpulan_then: Record<string, any>;
  bobot: number;
  deskripsi?: string;
  aktif: boolean;
  created_at?: string;
  penyakit_nama?: string;
  kondisi_readable?: string;
  kondisi_count?: number;
  penyakit_detail?: {
    nama: string;
    tingkat_bahaya: string;
    deskripsi: string;
  };
}

export interface JenisPenyakitChoice {
  id: string;
  nm_penyakit: string;
  tingkat_bahaya: string;
}

export interface FuzzyStatistik {
  total_parameter?: number;
  parameter_aktif?: number;
  parameter_non_aktif?: number;
  distribusi_tipe?: Record<string, number>;
  total_fungsi?: number;
  fungsi_aktif?: number;
  fungsi_non_aktif?: number;
  distribusi_tipe_fungsi?: Record<string, number>;
  top_parameter?: Array<{
    parameter: string;
    jumlah_fungsi: number;
  }>;
  total_aturan?: number;
  aturan_aktif?: number;
  aturan_non_aktif?: number;
  distribusi_penyakit?: Array<{
    penyakit: string;
    jumlah_aturan: number;
  }>;
  statistik_bobot?: {
    rata_rata: number;
    minimum: number;
    maksimum: number;
  };
}

export interface ListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination?: {
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export interface DetailResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
