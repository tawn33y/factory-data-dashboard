'use client';
import { FC, useEffect, useState } from "react";
import { FactoryData } from "../api/getFactoryData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// TODO: add different colors
// move to components/
// loop over array->charts
// add dropdown/toggle
// add pie chart for combined

interface LineChartCustomProps {
  title: string;
  data: Record<string, string | number>[];
}

const LineChartCustom: FC<LineChartCustomProps> = ({ title, data }) => {
  const { name, ...dataPoints } = data[0];

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <p className="font-bold mb-4">{title}</p>
      <div className="w-96 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(dataPoints).map((dataPoint) => (
              <Line
                key={dataPoint}
                type="monotone"
                dataKey={dataPoint}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface ChartsCanvasProps {
  data: FactoryData;
}

const ChartsCanvas: FC<ChartsCanvasProps> = ({ data }) => (
  <div className="bg-gray-100 w-dvh h-dvh overflow-auto py-8 px-24 flex flex-wrap gap-8 justify-center items-start">
    <LineChartCustom
      title="Water consumption (m3)"
      data={data.headers.map((header, idx) => ({
        name: header,
        waterConsumption: data.rows['Water consumption (m3)'][idx],
      }))}
    />
    <LineChartCustom
      title="Grid Electricity Consumption (KWh)"
      data={data.headers.map((header, idx) => ({
        name: header,
        gridElectricityConsumption: data.rows['Grid Electricity Consumption (KWh)'][idx],
      }))}
    />
    <LineChartCustom
      title="Food waste (Kg)"
      data={data.headers.map((header, idx) => ({
        name: header,
        foodWaste: data.rows['Food waste (Kg)'][idx],
      }))}
    />
    <LineChartCustom
      title="Combined"
      data={data.headers.map((header, idx) => ({
        name: header,
        waterConsumption: data.rows['Water consumption (m3)'][idx],
        gridElectricityConsumption: data.rows['Grid Electricity Consumption (KWh)'][idx],
        foodWaste: data.rows['Food waste (Kg)'][idx],
      }))}
    />
  </div>
);

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
