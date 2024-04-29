'use client';
import { useEffect, useState } from "react";
import { FactoryData } from "../api/getFactoryData";
import { ChartsCanvas } from "@/components/ChartsCanvas";

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
      <h2 className="text-2xl font-bold mb-4">Factory Environmental Test Data Analysis</h2>
      <ChartsCanvas data={data} />
    </div>
  );
}
