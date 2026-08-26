'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface PayoutRadialChartProps {
  percent: number;
}

export default function PayoutRadialChart({ percent }: PayoutRadialChartProps) {
  const data = [
    { name: 'progress', value: percent, fill: 'var(--primary)' },
    { name: 'remaining', value: 100 - percent, fill: 'var(--muted)' },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="70%"
        outerRadius="90%"
        startAngle={90}
        endAngle={-270}
        data={data}
        barSize={12}
      >
        <RadialBar
          dataKey="value"
          cornerRadius={6}
          background={{ fill: 'var(--muted)' }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}