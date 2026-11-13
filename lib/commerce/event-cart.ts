import "server-only";
import { gql } from "@shopify/hydrogen";
import { createPublicStorefront, createRequestContext } from "./storefront";

const EVENT_CART_MUTATION = gql(`
  mutation EventCartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`);

export type EventCartLine = {
  merchandiseId: string;
  quantity: number;
};

export type EventCartAttribute = {
  key: string;
  value: string;
};

export async function createEventCheckoutCart(
  request: Request,
  input: {
    lines: EventCartLine[];
    attributes: EventCartAttribute[];
    note: string;
  },
) {
  const client = createPublicStorefront(createRequestContext(request));
  const result = await client.graphql(EVENT_CART_MUTATION, {
    variables: {
      input: {
        lines: input.lines,
        attributes: input.attributes,
        note: input.note,
        buyerIdentity: { countryCode: "US" },
      },
    },
  });

  if (result.errors?.length) {
    throw new Error(
      result.errors
        .map((error) => error.message)
        .filter(Boolean)
        .join(" "),
    );
  }

  const payload = result.data?.cartCreate;
  const message = payload?.userErrors
    ?.map((error) => error.message)
    .filter(Boolean)
    .join(" ");
  if (message) throw new Error(message);

  const checkoutUrl = payload?.cart?.checkoutUrl;
  const cartId = payload?.cart?.id;
  if (!checkoutUrl || !cartId) {
    throw new Error("Shopify did not return a checkout URL");
  }
  return { checkoutUrl, cartId };
}
