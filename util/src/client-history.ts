import { keys } from '@baya/constants';
import { get, set } from 'idb-keyval';

interface Product {
  Id_Seller: number;
  Id_License: number;
}

export async function setClientActivity(product: Product) {
  if (!product.Id_Seller) return;
  if (!(await get(keys.ALLOW_HISTORY))) return;

  const hist = (await get<Product[] | undefined>(keys.CLIENT_HISTORY)) ?? [];
  const exists = hist.some((x: Product) => x.Id_License === product.Id_License);
  if (!exists) {
    hist.unshift(product);
  }
  if (hist.length > 15) {
    hist.pop();
  }
  await set(keys.CLIENT_HISTORY, hist);
}

export async function getClientActivity() {
  return (await get(keys.CLIENT_HISTORY)) ?? [];
}
