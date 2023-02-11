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
  //Читаємо параметри з url
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<IProductSearch>({
    name: searchParams.get("name") || "",
    page: searchParams.get("page") || 1,
    count: searchParams.get("count") || 10,
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
        {/* Кнопка для видалення */}
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

  //Створюємо масив кнопок за кількістю сторінок
  const buttons = [];
  for (let i = 1; i <= count_pages; i++) {
    buttons.push(i);
  }

  //Перебирає не пусті об'єкти
  function filterNonNull(obj: IProductSearch) {
    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));
  }

  //Метод для пагінації сторінок
  const pagination = buttons.map((page) => (
    <li key={page} className="page-item">
      <Link
        className={classNames("page-link", { active: current_page === page })}
        onClick={() => setSearch({ ...search, page })}
        //Створюємо і переходимо на посилання для обраної сторінки
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

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div className="mb-2" style={{ width: "768px" }}>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Назва"
              onChange={handleChange}
              value={values.name}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "96px",
              height: "38px",
            }}
            className="btn btn-primary mb-3"
          >
            Пошук
          </button>

          <select
            id="count"
            name="count"
            onChange={handleChange}
            style={{
              width: "96px",
              height: "38px",
            }}
            className="form-select"
          >
            <option defaultValue="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
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
          {/* Кнопки */}
          <ul className="pagination">{pagination}</ul>
        </nav>
      </div>
    </>
  );
};

export default HomePage;
