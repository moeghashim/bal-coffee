// Shared POS constants/types. Kept out of the "use server" action file because
// those files may only export async functions.

// Lenient on format (we don't know the badge scheme): starts alphanumeric,
// 2–32 chars, allowing spaces, dashes, dots and underscores.
export const BADGE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 ._-]{1,31}$/;

export type PosOrderState = {
  status: "idle" | "success" | "error";
  message: string;
  checkoutUrl?: string;
};
