import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import http from "../../http_common";
import { store } from "../../store";
import { IProductItem } from "./store/types";

const HomePage = () => {
  const { list } = useTypedSelector((store) => store.product);
  const dispatch = useDispatch();
  useEffect(() => {
    http.get<Array<IProductItem>>("/api/products").then((resp) => {
      console.log("Response data: ", resp);

      dispatch({
        type: "PRODUCT_LIST",
        payload: resp.data,
      });
    });
  }, []);

  const data = list.map((product) => (
    <tr key={product.id}>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.detail}</td>
    </tr>
  ));

  return (
    <>
      <h1 className="text-center mt-4 mb-3">Головна сторінка</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>{data}</tbody>
      </table>
    </>
  );
};

export default HomePage;
