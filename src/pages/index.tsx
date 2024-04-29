import { useEffect, useState } from "react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    import('../api/getFactoryData').then(({ getFactoryData }) => {
      getFactoryData()
        .then((result) => console.log(result))
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false));
    }).catch((error) => setError(error?.message ?? 'An error occurred'));
  }, []);

  if (isLoading) return (<p>Loading...</p>)
  if (error) return (<p className="text-red-500">{error}</p>)

  return (<p>hello world</p>)
}
