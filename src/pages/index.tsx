'use client'
import { useEffect, useState } from "react";
import { FactoryData } from "../api/getFactoryData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    <div className="p-4">
      <div className="w-full">
      {/* <ResponsiveContainer width="100%" height="100%"> */}
        <p>Food waste (Kg)</p>
        <LineChart
          width={500}
          height={300}
          data={data.headers.map((header, idx) => ({
            name: header,
            foodWaste: data.rows['Food waste (Kg)'][idx],
            waterConsumption: data.rows['Water consumption (m3)'][idx],
          }))}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="foodWaste" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="waterConsumption" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      {/* </ResponsiveContainer> */}
      </div>
    </div>
  );
}
