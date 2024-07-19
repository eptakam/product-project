import { useEffect, useState } from "react";

export default function LastSalesPage(props) {
  const [sales, setSales] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // useEffect permet de fetcher des donnees coté client
  useEffect(() => {
    setIsLoading(true);
    fetch('https://nextjs-course-7cc9a-default-rtdb.firebaseio.com/sales.json').then(response => response.json()).then(data => {
      // transforme l'objet sales (data) issue de firebase en tableau
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume
        });
      }

      setSales(transformedSales);
      setIsLoading(false);
    });
  }, []);

  // si isLoading est true, afficher 'Loading...'
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // si sales est undefined, afficher 'No sales yet'
  if (!sales) {
    return <p>No sales yet</p>;
  }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - ${sale.volume}
        </li>
      ))}
    </ul>
  );
}