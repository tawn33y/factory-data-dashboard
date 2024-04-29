'use client'
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FactoryData } from "../api/getFactoryData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResponsiveLine = dynamic(() => import("@nivo/line").then(m => m.ResponsiveLine), { ssr: false });

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

  const yy = [
    {
      id: 'Food waste (Kg)',
      color: 'hsl(25, 70%, 50%)',
      data: data.rows['Food waste (Kg)'].map((cell, idx) => ({
        x: data.headers[idx],
        y: cell,
      })),
    },
    {
      id: 'Water consumption (m3)',
      color: 'hsl(60, 70%, 50%)',
      data: data.rows['Water consumption (m3)'].map((cell, idx) => ({
        x: data.headers[idx],
        y: cell,
      })),  
    },
  ];

  return (
    <div className="p-4">
      <div style={{ height: 400 }}>
        <p>Food waste (Kg)</p>
        <ResponsiveLine
          data={yy}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'transportation',
            legendOffset: 36,
            legendPosition: 'middle',
            truncateTickAt: 0
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: -40,
            legendPosition: 'middle',
            truncateTickAt: 0
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableTouchCrosshair={true}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </div>

      <div className="w-full">
      {/* <ResponsiveContainer width="100%" height="100%"> */}
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
