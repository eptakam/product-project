import { useEffect, useState } from "react";
import useSWR from "swr";

export default function LastSalesPage(props) {
  const [sales, setSales] = useState(props.sales);
  // const [isLoading, setIsLoading] = useState(false);

  // SWR est une librairie qui permet de fetcher des donnees cote client. elle est tres utile pour les donnees qui changent frequemment. elle permet de mettre en cache les donnees et de les mettre a jour automatiquement. pour qu'elle fonctionne, il faut lui passer comme segond argument une fonction fetcher qui prend en parametre l'url a fetcher et qui retourne une promesse.
  // SWR est utilise uniquement dans les composants React et pas dans les fonctions getServerSideProps ou getStaticProps

  // const fetcher = (...args) => fetch(...args).then(res => res.json())
  const fetcher = (url) => fetch(url).then((response) => response.json());
  const { data, error } = useSWR(
    "https://nextjs-course-7cc9a-default-rtdb.firebaseio.com/sales.json",
    fetcher
  );

  console.log("data", data);

  // en utilisant le hook 'useSWR', nous faisons egalement face au fait que les donnees ne sont pas dans le bon format (tableau) et nous devons les transformer en tableau. pour cela, nous avons deux options: 1) definir une fonction fetcher(). 2) utiliser useEffect pour transformer les donnees en tableau
  useEffect(() => {
    if (data) {
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }

      setSales(transformedSales);
    }
  }, [data]);

  // useEffect permet de fetcher des donnees coté client
  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch('https://nextjs-course-7cc9a-default-rtdb.firebaseio.com/sales.json').then(response => response.json()).then(data => {
  //     // transforme l'objet sales (data) issue de firebase en tableau
  //     const transformedSales = [];

  //     for (const key in data) {
  //       transformedSales.push({
  //         id: key,
  //         username: data[key].username,
  //         volume: data[key].volume
  //       });
  //     }

  //     setSales(transformedSales);
  //     setIsLoading(false);
  //   });
  // }, []);

  // si isLoading est true, afficher 'Loading...'
  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // si error est different de null, afficher 'Failed to load'
  if (error) {
    return <p>Failed to load</p>;
  }

  // si nous n'avons pas encore de donnees, c'est que les donnees sont en cours de chargement.
  // if (!data || !sales) {
  //   return <p>Loading...</p>;
  // }

  // vue que maintenant nous avons initialise sales avec props.sales, nous n'avons plus besoin de cette verification car sales aura un contenu au premier rendu d'ou le ET logique a la place du OU logique ci-dessus
  if (!data && !sales) {
    return <p>Loading...</p>;
  }

  // si sales est undefined, afficher 'No data yet'. nous sommes obliges de faire cette verification car sales est un state et il est undefined au debut et useEffect n'est execute qu'apres le premier rendu et apres chaque mise a jour du composant qui lui est undefined (useState(false)).donc sans cette verification, nous aurons une erreur.
  // if (!sales) {
  //   return <p>No data yet</p>;
  // }

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

// nous voulons combiner 'client-side data fetching' avec 'server-side data fetching'. pour cela, nous allons utiliser getServerSideProps ou getStaticProps pour fetcher les donnees cote serveur et les passer au composant. ensuite, nous allons utiliser useSWR pour fetcher les donnees cote client et les mettre a jour automatiquement.
// cette combinaison  est utile lorsque nous voulons pre-render instannement les donnees cote serveur tout en recuperant les donnees cote client pour les mettre a jour automatiquement.
export async function getStaticProps() {
  const response = await fetch(
    "https://nextjs-course-7cc9a-default-rtdb.firebaseio.com/sales.json"
  );
  const data = await response.json();

  // transforme l'objet sales (data) issue de firebase en tableau
  const transformedSales = [];

  for (const key in data) {
    transformedSales.push({
      id: key,
      username: data[key].username,
      volume: data[key].volume,
    });
  }

  return {
    props: {
      sales: transformedSales,
      revalidate: 10,
    },
  };
}
