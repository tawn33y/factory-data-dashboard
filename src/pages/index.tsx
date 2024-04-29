'use client';
import { FC, useEffect, useState } from "react";
import { FactoryData } from "../api/getFactoryData";
import { LineChart } from "@/components/LineChart";

// TODO:
// add different colors
// add dropdown/toggle
// add pie chart for combined

interface ChartsCanvasProps {
  data: FactoryData;
}

const ChartsCanvas: FC<ChartsCanvasProps> = ({ data }) => {
  console.log(Object.keys(data.rows))
  // const charts = 
  return (
    <div className="bg-gray-100 w-dvh h-dvh overflow-auto py-8 px-24 flex flex-wrap gap-8 justify-center items-start">
      {Object.keys(data.rows).map((stat) => (
        <LineChart
          key={stat}
          title={stat}
          data={data.headers.map((header, idx) => ({
            name: header,
            // [stat.replaceAll(/[^a-zA-Z0-9]/g, ' ')]: data.rows[stat][idx],
            [stat]: data.rows[stat][idx],
          }))}
        />
      ))}
      <LineChart
        width="56rem"
        height="24rem"
        title="Combined"
        data={data.headers.map((header, idx) => ({
          name: header,
          ...Object.keys(data.rows).map((stat) => ({
            // [stat.replaceAll(/[^a-zA-Z0-9]/g, ' ')]: data.rows[stat][idx],
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
    <ChartsCanvas data={data} />
  );
}
