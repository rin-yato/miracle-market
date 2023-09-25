export async function load(loadEvent) {
  const { fetch, url } = loadEvent;
  const LIMIT = 8;

  const skip = (parseInt(url.searchParams.get('page') ?? '1') - 1) * LIMIT;

  const fetchUrl = new URL('https://dummyjson.com/products');
  fetchUrl.searchParams.set('limit', LIMIT.toString());
  fetchUrl.searchParams.set('skip', skip.toString());

  const products = await (await fetch(fetchUrl.toString())).json();

  console.log('products', products);

  return {
    products,
  };
}
