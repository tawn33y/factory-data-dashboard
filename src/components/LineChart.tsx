import classNames from 'classnames';
import { FC } from 'react';
import { LineChart as LineChartRecharts, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  title?: string;
  width?: string;
  height?: string;
  data: Record<string, string | number>[];
}

export const LineChart: FC<LineChartProps> = ({ title, data, width = '24rem', height = '24rem' }) => {
  const { name, ...dataPoints } = data[0];

  return (
    <div
      className={classNames({
        'bg-white px-4 shadow-md rounded-lg': true,
        'py-6': !!title,
        'py-10': !title,
      })}
    >
      {title && (
        <p className="font-bold mb-4">{title}</p>
      )}
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChartRecharts
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
          </LineChartRecharts>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
