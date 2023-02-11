import classNames from "classnames";
import { useFormik } from "formik";
import qs from "qs";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useActions } from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { IProductSearch } from "./store/types";

const HomePage = () => {
  const { list, count_pages, current_page, total } = useTypedSelector(
    (store) => store.product
  );
  const { GetProductList, DeleteProduct } = useActions();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<IProductSearch>({
    name: searchParams.get("name") || "",
    page: searchParams.get("page") || 1,
  });

  useEffect(() => {
    GetProductList(search);
  }, [search]);

  async function handleDeleteProduct(product_id: number) {
    console.log(product_id);

    await DeleteProduct(product_id);
    window.location.reload();
  }

  const data = list.map((product) => (
    <tr key={product.id}>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.detail}</td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => {
            handleDeleteProduct(product.id!);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  const buttons = [];
  for (let i = 1; i <= count_pages; i++) {
    buttons.push(i);
  }

  function filterNonNull(obj: IProductSearch) {
    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));
  }

  const pagination = buttons.map((page) => (
    <li key={page} className="page-item">
      <Link
        className={classNames("page-link", { active: current_page === page })}
        onClick={() => setSearch({ ...search, page })}
        to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
      >
        {page}
      </Link>
    </li>
  ));

  const onSubmit = (values: IProductSearch) => {
    const filter = { ...values, page: 1 };
    setSearchParams(qs.stringify(filterNonNull(filter)));
    setSearch(filter);
  };

  const formik = useFormik({
    initialValues: search,
    onSubmit: onSubmit,
  });

  const { handleSubmit, values, handleChange } = formik;

  return (
    <>
      <div className="w-75" style={{ margin: "0 auto" }}>
        <h1 className="text-center mt-4 mb-3">Головна сторінка</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="name">Назва</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              onChange={handleChange}
              value={values.name}
            />
          </div>

          <button type="submit" className="btn btn-primary mb-3">
            Пошук
          </button>
        </form>

        <h4>
          Всього продуктів: <strong>{total}</strong>
        </h4>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Detail</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>{data}</tbody>
        </table>
        <nav>
          <ul className="pagination">{pagination}</ul>
        </nav>
      </div>
    </>
  );
};

export default HomePage;
