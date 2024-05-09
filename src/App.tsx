import { Route, Routes } from "react-router-dom";
import { Products } from "./components/Products";

import ProductForm from "./form/ProductForm";
import Login from "./security/Login";
import Logout from "./security/Logout";
import OpretForm from "./security/OpretForm";
import RequireAuth from "./security/RequireAuth";
import Layout from "./Layout";
import Home from "./Home";
import "./App.css";

export default function App() {
  //const auth = useAuth();
  return (
      <Layout>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/" element={<Products />} />

              {/* <Route path="/add" */}

              <Route
                  path="/addProduct"
                  element={
                      <RequireAuth roles={["ADMIN"]}>
                          <ProductForm />
                      </RequireAuth>
                  }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/opret" element={<OpretForm />} />
          </Routes>
      </Layout>
  );
}
