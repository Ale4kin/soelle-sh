export interface CartItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    priceV2: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      handle: string;
      images: {
        edges: {
          node: {
            url: string;
            altText: string | null;
          };
        }[];
      };
    };
  };
}

export interface CartResponse {
  cart: {
    id: string;
    totalQuantity: number;
    cost: {
      totalAmount: {
        amount: string;
        currencyCode: string;
      };
    };
    checkoutUrl: string;
    lines: {
      edges: {
        node: CartItem;
      }[];
    };
  };
}

export interface CreateCartResponse {
  cartCreate: {
    cart: {
      id: string;
      totalQuantity: number;
      checkoutUrl: string;
    };
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface AddToCartResponse {
  cartLinesAdd: {
    cart: {
      id: string;
      totalQuantity: number;
    };
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}
