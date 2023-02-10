import { Dispatch } from "react";
import http from "../../../http_common";
import {
  IProductItem,
  IProductResponse,
  IProductSearch,
  ProductActions,
  ProductActionTypes,
} from "./types";

export const GetProductList =
  (search: IProductSearch) => async (dispatch: Dispatch<ProductActions>) => {
    try {
      const resp = await http.get<IProductResponse>("/api/products", {
        params: search,
      });
      console.log("Response data: ", resp);

      dispatch({
        type: ProductActionTypes.PRODUCT_LIST,
        payload: {
          list: resp.data.data,
          count_pages: resp.data.last_page,
          current_page: resp.data.current_page,
          total: resp.data.total,
        },
      });
    } catch (err: any) {}
  };

export const DeleteProduct =
  (product_id: number) => async (dispath: Dispatch<ProductActions>) => {
    try {
      const resp = await http.delete<IProductResponse>(
        `/api/products/delete/${product_id}`
      );
      const { data } = resp;
      dispath({
        type: ProductActionTypes.PRODUCT_REMOVE,
        payload: {
          list: data.data,
          total: data.total,
          current_page: data.current_page,
          count_pages: data.last_page,
        },
      });
    } catch (err: any) {}
  };
