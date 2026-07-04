/**
 * Bal Coffee commerce adapter — the stable interface over @shopify/hydrogen.
 *
 * App and UI code import from here (never from `@shopify/hydrogen` directly).
 * This boundary is what lets us pull upstream Hydrogen preview updates without
 * breaking the app: any API drift is absorbed inside lib/commerce/.
 * See HYDROGEN_MIGRATION.md.
 */
export {
  getStorefrontProductByHandle,
  getStorefrontProductsByHandles,
} from "./products";
export { formatPrice } from "./money";
