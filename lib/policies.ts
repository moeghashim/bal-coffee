import "server-only";

const POLICY_ORIGIN = "https://balcoffee-store.myshopify.com";

export async function getShopifyPolicy(handle: string) {
  try {
    const response = await fetch(`${POLICY_ORIGIN}/policies/${handle}.json`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as {
      policy?: { title?: string; body?: string };
    };
    const html = body.policy?.body?.trim();
    if (!html) return null;
    return {
      title: body.policy?.title?.trim() || "",
      html: sanitizePolicyHtml(html),
    };
  } catch {
    return null;
  }
}

function sanitizePolicyHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}
