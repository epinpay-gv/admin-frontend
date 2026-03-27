export type FilterValue = string | number | undefined;

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  options?: FilterOption[];
  placeholder?: string;
}

export type FilterData = Record<string, FilterValue>;

export interface FilterPanelProps {
  configs: FilterField[];
  onApply: (filters: FilterData) => void;
  onReset: () => void;
  initialFilters: FilterData;
}