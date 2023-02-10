import { IProductState, ProductActions, ProductActionTypes } from "./types";

const initialState: IProductState = {
  list: [],
  count_pages: 0,
  current_page: 0,
  total: 0,
};

export const productReducer = (
  state = initialState,
  action: ProductActions
): IProductState => {
  switch (action.type) {
    case ProductActionTypes.PRODUCT_LIST: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case ProductActionTypes.PRODUCT_REMOVE: {
      return {
        ...state,
      };
    }
    case ProductActionTypes.PRODUCT_CREATE: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};
