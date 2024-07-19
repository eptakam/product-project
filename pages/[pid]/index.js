import path from 'path';  // path est un module node.js qui permet de manipuler des chemins de fichiers
import fs from 'fs/promises';  // fs (file system) est un module node.js qui permet de lire des fichiers cote serveur
import { Fragment } from "react";

export default function ProductDetailPage(props) {
  const { loadedProduct } = props;

  // si loadedProduct n'est pas encore chargé, afficher un loader -> ceci est necessaire si fallback est true
  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

// dans la realite, nous n'allons pas harcoder les id comme nous l'avons fait dans getStaticProps. mais plustot nous les fetcherons de la bd. 
async function getData() {
  
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

// nous allons utiliser getStaticProps pour charger les données de la page. sauf que cette fois nous ne chargerons qu'un seul produit a la fois en fonction de l'id du produit. nous nous servirons du parametre 'context' pour recuperer l'id du produit
// Attention: lorsqu'on a un segment dynamique comme c'est notre cas, ne pas perdre de vue que getStaticProps ne fera pas le pre-rendering des pages. Car il ne saura pas a l'avance les valeurs des segments dynamiques. 
// Solution: Il faudra donc utiliser getStaticPaths pour lui donner les valeurs des segments dynamiques 
export async function getStaticProps(context){
  const {params} = context;
  const productId = params.pid;   // pid est le nom du parametre dynamique du dossier [pid]
  // [pid] sera le segment apres le localhost:3000/ dans l'url. ex: pour localhost:3000/1, pid sera 1

  const data = await getData();

  // filtrer le produit dont l'id est egal a productId
  const product = data.products.find(product => product.id === productId);

  // le produit n'existe pas et fallback est true
  if(!product){
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product
    }
  }
}

// getStaticPaths est une fonction qui permet de dire a next.js quels sont les segments dynamiques que nous avons dans notre page pour qu'il puisse les pre-render
export async function getStaticPaths(){
  const data = await getData();

  // recuperer les ids des produits et les mettre dans un tableau
  const ids = data.products.map(product => product.id);

  // transformer les ids en tableau d'objet pour les passer a la cle 'paths' de l'objet retourne par getStaticPaths
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));

  return {
    // paths: tableau d'objets contenant les ids des produits
    paths: pathsWithParams,
    // paths: [
    //   {params: {pid: 'p1'}},
    //   {params: {pid: 'p2'}},
    //   {params: {pid: 'p3'}},
    // ],
    // fallback: false   
    fallback: true 
    // fallback: 'blocking'
    
    /*
      le 'fallback' key est important lorsqu'on a plusieurs pages dynamiques

      - on peut le setter a 'true' pour ne pre-render que quelques pages dynamiques et laisser les autres a la demande. dans ce cas, seules les pages listees dans 'paths' seront pre-render (pages beaucoup visitees) et les autres seront pre-render a la demande

      - Attention: si on met 'fallback' a 'true', on doit retourner son etat a notre composant pour qu'il sache que la page est en cours de pre-render et qu'il doit afficher un loader en attendant que la page soit pre-render pour eviter les erreurs (voir exemple ci-dessus)

      - on peut le setter a 'blocking'. dans ce cas, on a plus besoin de retourner l'etat de 'fallback' a notre composant car next.js attendra que toutes les pages soient pre-render avant de les afficher. c'est le meme comportement que 'true' sauf que les pages seront pre-render avant d'etre affichees, ce qui prendra un plus de temps pour afficher la page
    */
  }
}