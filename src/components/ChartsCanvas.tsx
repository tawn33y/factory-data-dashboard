import { FC, useState } from "react";
import { FactoryData } from "@/api/getFactoryData";
import { Filters } from "./Filters";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";

interface ChartsCanvasProps {
  data: FactoryData;
}

export const ChartsCanvas: FC<ChartsCanvasProps> = ({ data }) => {
  const months = data.headers;
  const stats = Object.keys(data.rows);
  const monthsOptions = months.map((month) => ({
    code: month.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
    label: month,
  }));
  const statsOptions = stats.map((stat) => ({
    code: stat.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
    label: stat,
  }));
  const chartOptions = [
    {
      code: 'line',
      label: 'Line Chart',
    },
    {
      code: 'pie',
      label: 'Pie Chart',
    },
  ];

  const [filteredMonthIds, setFilteredMonthIds] = useState<string[]>(monthsOptions.map((month) => month.code));
  const [filteredStatIds, setFilteredStatIds] = useState<string[]>(statsOptions.map((stat) => stat.code));
  const [filteredChartId, setFilteredChartId] = useState<string>(chartOptions[0].code);
  const [showComparison, setShowComparison] = useState(false);

  const filteredMonths = monthsOptions.filter((month) => filteredMonthIds.includes(month.code));
  const filteredStats = statsOptions.filter((stat) => filteredStatIds.includes(stat.code));
  const filteredChart = chartOptions.find((chart) => chart.code === filteredChartId) ?? chartOptions[0];
  
  return (
    <>
      <Filters
        statsOptions={statsOptions}
        monthsOptions={monthsOptions}
        chartOptions={chartOptions}
        filteredStats={filteredStats}
        filteredMonths={filteredMonths}
        filteredChart={filteredChart}
        showComparison={showComparison}
        onFilteredStatIds={setFilteredStatIds}
        onFilteredMonthIds={setFilteredMonthIds}
        onFilteredChartId={setFilteredChartId}
        onShowComparison={setShowComparison}
      />
    
      {filteredMonthIds.length > 0 && (
        <div className="flex flex-wrap gap-8 justify-center items-start">
          {!showComparison && filteredStats.map(({ label: stat }) => (
            <>
              {filteredChart.code === 'line' && (
                <LineChart
                  key={stat}
                  title={stat}
                  data={monthsOptions.map(({ label: month }, idx) => ({
                    name: month,
                    value: data.rows[stat][idx],
                  })).filter((month) => filteredMonths.map(({ label }) => label).includes(month.name))}
                />
              )}
              {filteredChart.code === 'pie' && (
                <PieChart
                  key={stat}
                  title={stat}
                  data={monthsOptions.map(({ label: month }, idx) => ({
                    name: month,
                    value: data.rows[stat][idx],
                  })).filter((month) => filteredMonths.map(({ label }) => label).includes(month.name))}
                />
              )}
            </>
          ))}
          {showComparison && (
            <LineChart
              width="56rem"
              height="24rem"
              data={monthsOptions.map(({ label: month }, idx) => ({
                name: month,
                ...filteredStats.map(({ label: stat }) => ({
                  [stat]: data.rows[stat][idx],
                })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
              })).filter((month) => filteredMonths.map(({ label }) => label).includes(month.name))}
            />
          )}
        </div>
      )}
    </>
  );
};
