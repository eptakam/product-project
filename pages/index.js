import path from 'path';  // path est un module node.js qui permet de manipuler des chemins de fichiers
import fs from 'fs/promises';  // fs (file system) est un module node.js qui permet de lire des fichiers cote serveur

export default function HomePage(props) {
  const { products } = props;

  // Vérifiez si products est défini avant de l'utiliser
  if (!products) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}

// faire un static generation avant que ce composant soit rendu pour justement avoir les données avant le rendu car contrairement a l'approche 'App Router' dans laquelle les composant sont des 'server components' et donc les données sont chargées au moment du rendu, avec l'appproche 'Pages Router', il faut dire a next.js de faire un 'static generation' avant le rendu du composant pour avoir les données avant le rendu.
// ceci sera execute seulement au moment de la generation de la page
export async function getStaticProps() {
  // Note: vu que getStaticProps est exécuté côté serveur, on peut lire directement des fichiers system (cote serveur) avec fs etant dans notre composant sans avoir besoin de les importer
  // fs.readFileSync() lit le contenu d'un fichier
  // cwd (current working directory) est le répertoire de travail courant
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);  // JSON.parse() convertit une chaîne JSON en objet JavaScript

  return {
    props: {
      products: data.products,  // data est un objet qui contient un tableau de produits
    },
  };
}
