const NANP = /^[2-9]\d{2}[2-9]\d{6}$/;

/** US mobile numbers only, normalized to E.164 (+1XXXXXXXXXX). */
export function toUsE164(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const national =
    digits.length === 11 && digits.startsWith("1")
      ? digits.slice(1)
      : digits.length === 10
        ? digits
        : "";
  if (!NANP.test(national)) return null;
  return `+1${national}`;
}

export function formatUsPhone(phone: string) {
  const match = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(phone);
  const area = match?.[1];
  const prefix = match?.[2];
  const line = match?.[3];
  if (!area || !prefix || !line) return phone;
  return `+1 (${area}) ${prefix}-${line}`;
}

export function normalizeFirstName(input: string): string | null {
  const name = input.replace(/\s+/g, " ").trim();
  if (name.length < 1 || name.length > 40) return null;
  if (!/^[\p{L}][\p{L}\p{M} .'’-]*$/u.test(name)) return null;
  return name;
}

export function checkoutStorageKey(ref: string) {
  return `bal-event-checkout:${ref}`;
}
