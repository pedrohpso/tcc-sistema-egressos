import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Chart.css';

interface ChartProps {
  data: Record<string, string>[];
  type: string;
}

const Chart: React.FC<ChartProps> = ({ data, type }) => {
  const isTotalGrouping = data.length === 1 && data[0].name === 'Total';

  switch (type) {
    case 'bar':
      return (
        <ResponsiveContainer width="95%" height={400}>
          <BarChart
            data={data}
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
            {Object.keys(data[0])
              .filter(key => key !== 'name')
              .map((key, index) => (
                <Bar
                  key={index}
                  dataKey={key}
                  stroke="#000000"
                  strokeWidth={1}
                  fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
          </BarChart>
        </ResponsiveContainer>
      );
    case 'pie':
      const pieData = Object.keys(data[0])
        .filter(key => key !== 'name')
        .map((key) => ({
          name: key,
          value: data.reduce((acc, curr) => acc + (parseInt(curr[key], 10) || 0), 0),
        }));

      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {pieData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    case 'table':
      return (
        <table border={1} cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th></th>
              {isTotalGrouping ? (
                <th>Total</th>
              ) : (
                data.map((item, index) => (
                  <th key={index}>{item.name}</th> 
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {Object.keys(data[0])
              .filter(key => key !== 'name')
              .map((indicator, index) => (
                <tr key={index}>
                  <td>{indicator}</td>
                  {isTotalGrouping ? (
                    <td>{data[0][indicator]}</td>
                  ) : (
                    data.map((item, idx) => (
                      <td key={idx}>{item[indicator]}</td>
                    ))
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      );
    default:
      return <div>Selecione um tipo de visualização</div>;
  }
};

export default Chart;
