import path from "path"; // path est un module node.js qui permet de manipuler des chemins de fichiers
import fs from "fs/promises"; // fs (file system) est un module node.js qui permet de lire des fichiers cote serveur
import Link from "next/link";
import { notFound } from "next/navigation";

export default function HomePage(props) {
  const { products } = props;

  // Vérifiez si products est défini avant de l'utiliser
  if (!products) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

// faire un static generation avant que ce composant soit rendu pour justement avoir les données avant le rendu car contrairement a l'approche 'App Router' dans laquelle les composant sont des 'server components' et donc les données sont chargées au moment du rendu, avec l'appproche 'Pages Router', il faut dire a next.js de faire un 'static generation' avant le rendu du composant pour avoir les données avant le rendu.
// ceci sera execute seulement au moment de la generation de la page 
// *** Important: *** getStaticProps() n'est pas appelee pour la requete actuelle (entrante) mais generalement lors de la generation de la page. Elle n'a pas aussi acces aux donnees de la requete actuelle (entrante)
// donc pour pre-render une page pour chaque requete actuelle (entrante), nous avons besoin de getServerSideProps() qui est une function dans laquelle nous mettrons un 'real server-side code' et qui est execute a chaque requete
// getStaticProps peut prendre un parametre 'context' qui contient des informations sur la requete
export async function getStaticProps(context) {
  // Note: vu que getStaticProps est exécuté côté serveur, on peut lire directement des fichiers system (cote serveur) avec fs etant dans notre composant sans avoir besoin de les importer
  // fs.readFileSync() lit le contenu d'un fichier
  // cwd (current working directory) est le répertoire de travail courant
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData); // JSON.parse() convertit une chaîne JSON en objet JavaScript

  if (!data) {
    return {
      redirect: {
        destination: "/no-data",
      },
    };
  }

  if (data.products.length === 0) {
    return { notFound: true }; // si le tableau de produits est vide, renvoyer une page 404
  }

  return {
    props: {
      products: data.products, // data est un objet qui contient un tableau de produits
    },
    revalidate: 10, // revalidate est une option qui permet de regénérer la page après 10 secondes. c'est ce qu'on appelle l'incremental static regeneration (ISR)
    //notFound: true,  // notFound est une option qui permet de renvoyer une page 404 si les données ne sont pas trouvées
    //redirect: {  // redirect est une option qui permet de rediriger l'utilisateur vers une autre page si les données ne sont pas trouvées
  };
}
