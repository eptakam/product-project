import path from 'path';  // path est un module node.js qui permet de manipuler des chemins de fichiers
import fs from 'fs/promises';  // fs (file system) est un module node.js qui permet de lire des fichiers cote serveur
import { Fragment } from "react";

export default function ProductDetailPage(props) {
  const { loadedProduct } = props;

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

// nous allons utiliser getStaticProps pour charger les données de la page. sauf que cette fois nous ne chargerons qu'un seul produit a la fois en fonction de l'id du produit. nous nous servirons du parametre 'context' pour recuperer l'id du produit
// Attention: lorsqu'on a un segment dynamique comme c'est notre cas, ne pas perdre de vue que getStaticProps ne fera pas le pre-rendering des pages. Car il ne saura pas a l'avance les valeurs des segments dynamiques. 
// Solution: Il faudra donc utiliser getStaticPaths pour lui donner les valeurs des segments dynamiques 
export async function getStaticProps(context){
  const {params} = context;
  const productId = params.pid;   // pid est le nom du parametre dynamique du dossier [pid]
  // [pid] sera le segment apres le localhost:3000/ dans l'url. ex: pour localhost:3000/1, pid sera 1

  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  // filtrer le produit dont l'id est egal a productId
  const product = data.products.find(product => product.id === productId);

  return {
    props: {
      loadedProduct: product
    }
  }
}

// getStaticPaths est une fonction qui permet de dire a next.js quels sont les segments dynamiques que nous avons dans notre page pour qu'il puisse les pre-render
export async function getStaticPaths(){
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs

  return {
    paths: [
      {params: {pid: 'p1'}},
      {params: {pid: 'p2'}},
      {params: {pid: 'p3'}},
    ],
    fallback: false   // fallback est une option qui permet de dire a next.js de renvoyer une page 404 si le segment dynamique n'est pas trouvé
  }
}