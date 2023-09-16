import Action from './action.svelte';
import Checkbox from './checkbox.svelte';
import DataTable from './data-table.svelte';
import { BodyRow, DataBodyCell } from 'svelte-headless-table';

export { Action, Checkbox, DataTable };

export const sortableColumns: Array<keyof Product> = [
  'price',
  'discountPercentage',
  'rating',
  'stock'
];

export function isSortableColumn(column: string): column is keyof Product {
  return sortableColumns.includes(column as keyof Product);
}

export function getColumnValue(
  row: BodyRow<Product>,
  column: keyof Product
) {
  const cell = row.cellForId[column] as DataBodyCell<Product>;

  return cell.value as string;
}

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};
