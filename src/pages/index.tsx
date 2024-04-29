'use client';
import { FC, useEffect, useState } from "react";
import { FactoryData } from "../api/getFactoryData";
import { LineChart } from "@/components/LineChart";

// TODO:
// add pie chart, bar chart
// add dropdown/toggle

interface ChartsCanvasProps {
  data: FactoryData;
}

const ChartsCanvas: FC<ChartsCanvasProps> = ({ data }) => {
  return (
    <div className="flex flex-wrap gap-8 justify-center items-start">
      {Object.keys(data.rows).map((stat) => (
        <LineChart
          key={stat}
          title={stat}
          data={data.headers.map((header, idx) => ({
            name: header,
            value: data.rows[stat][idx],
          }))}
        />
      ))}
      <LineChart
        width="56rem"
        height="24rem"
        data={data.headers.map((header, idx) => ({
          name: header,
          ...Object.keys(data.rows).map((stat) => ({
            [stat]: data.rows[stat][idx],
          })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        }))}
      />
    </div>
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
