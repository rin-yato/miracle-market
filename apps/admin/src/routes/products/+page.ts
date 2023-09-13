export async function load(loadEvent) {
  const { fetch } = loadEvent;

  const products = await fetch('https://dummyjson.com/products');

  return {
    products: products.json()
  };
}
