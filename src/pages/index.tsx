'use client';
import { FC, useEffect, useState } from "react";
import { MultiSelect } from 'primereact/multiselect';
import { FactoryData } from "../api/getFactoryData";
import { LineChart } from "@/components/LineChart";

// TODO:
// add pie chart, bar chart
// add dropdown/toggle

const Filters: FC = () => (
  <></>
);

interface ChartsCanvasProps {
  data: FactoryData;
}

const ChartsCanvas: FC<ChartsCanvasProps> = ({ data }) => {
  const months = data.headers;
  const stats = Object.keys(data.rows);
  const monthsOptions = months.map((month) => ({
    id: month.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
    label: month,
  }));
  const statsOptions = stats.map((stat) => ({
    code: stat.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
    label: stat,
  }));

  const [filteredMonthIds, setFilteredMonthIds] = useState<string[]>(monthsOptions.map((month) => month.id));
  const [filteredStatIds, setFilteredStatIds] = useState<string[]>(statsOptions.map((stat) => stat.code));
  const [showComparison, setShowComparison] = useState(false);

  const filteredMonths = monthsOptions.filter((month) => filteredMonthIds.includes(month.id));
  const filteredStats = statsOptions.filter((stat) => filteredStatIds.includes(stat.code));
  
  return (
    <>
      <div className="flex flex-wrap gap-4 mb-4">
        <MultiSelect
          options={statsOptions}
          value={filteredStats}
          onChange={(e) => setFilteredStatIds(e.value.map((stat: any) => stat.code))}
          optionLabel="label"
          placeholder="Stats"
          maxSelectedLabels={0}
          className="px-4 py-2 rounded-md shadow-md"
          selectAllLabel="Show All"
        />
        <MultiSelect
          options={monthsOptions}
          value={filteredMonths}
          onChange={(e) => setFilteredMonthIds(e.value.map((month: any) => month.code))}
          optionLabel="label"
          placeholder="Months"
          maxSelectedLabels={0}
          className="px-4 py-2 rounded-md shadow-md"
          selectAllLabel="Show All"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={(e) => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide Comparison' : 'Show Comparison'}
        </button>
      </div>
    
      <div className="flex flex-wrap gap-8 justify-center items-start">
        {!showComparison && filteredStats.map(({ label: stat }) => (
          <LineChart
            key={stat}
            title={stat}
            data={filteredMonths.map(({ label: month }, idx) => ({
              name: month,
              value: data.rows[stat][idx],
            }))}
          />
        ))}
        {showComparison && (
          <LineChart
            width="56rem"
            height="24rem"
            data={filteredMonths.map(({ label: month }, idx) => ({
              name: month,
              ...filteredStats.map(({ label: stat }) => ({
                [stat]: data.rows[stat][idx],
              })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
            }))}
          />
        )}
      </div>
    </>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState<FactoryData | null>(null);

  useEffect(() => {
    import('../api/getFactoryData').then(({ getFactoryData }) => {
      getFactoryData()
        .then((result) => setData(result))
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false));
    }).catch((error) => setError(error?.message ?? 'An error occurred'));
  }, []);

  if (isLoading) return (<p>Loading...</p>);
  if (error) return (<p className="text-red-500">{error}</p>);
  if (!data) return (<p>No data</p>);

  return (
    <div className="py-8 px-4 lg:px-24">
      <h2 className="text-2xl font-bold mb-8">Factory Environmental Test Data Analysis</h2>
      <ChartsCanvas data={data} />
    </div>
  );
}
