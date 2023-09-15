export async function load(loadEvent) {
  const { fetch } = loadEvent;

  const products = await fetch('https://dummyjson.com/products?limit=10');

  return {
    products: products.json()
  };
}
