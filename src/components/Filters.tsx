import { FC } from "react";
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';

interface Option {
  code: string;
  label: string;
}

interface FiltersProps {
  statsOptions: Option[];
  monthsOptions: Option[];
  chartOptions: Option[];
  filteredStats: Option[];
  filteredMonths: Option[];
  filteredChart: Option;
  showComparison: boolean;
  onFilteredStatIds: (ids: string[]) => void;
  onFilteredMonthIds: (id: string[]) => void;
  onFilteredChartId: (id: string) => void;
  onShowComparison: (value: boolean) => void;
  onReset: () => void;
}

export const Filters: FC<FiltersProps> = ({ ...props }) => (
  <div className="flex flex-wrap gap-4 mb-8">
    <MultiSelect
      options={props.statsOptions}
      value={props.filteredStats}
      onChange={(e) => props.onFilteredStatIds(e.value.map((stat: any) => stat.code))}
      optionLabel="label"
      placeholder="Stats"
      maxSelectedLabels={0}
      className="px-4 py-2 rounded-md shadow-md"
      selectAllLabel="Show All"
    />
    <MultiSelect
      options={props.monthsOptions}
      value={props.filteredMonths}
      onChange={(e) => props.onFilteredMonthIds(e.value.map((month: any) => month.code))}
      optionLabel="label"
      placeholder="Months"
      maxSelectedLabels={0}
      className="px-4 py-2 rounded-md shadow-md"
      selectAllLabel="Show All"
    />
    <Dropdown
      value={props.filteredChart}
      onChange={(e) => props.onFilteredChartId(e.value.code)}
      options={props.chartOptions}
      optionLabel="label"
      placeholder="Chart"
      className="w-48 px-4 py-2 rounded-md shadow-md"
    />
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
      onClick={(e) => props.onShowComparison(!props.showComparison)}
    >
      {props.showComparison ? 'Hide Comparison' : 'Show Comparison'}
    </button>
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
      onClick={(e) => props.onReset()}
    >
      Reset
    </button>
  </div>
);
