// eslint-disable-next-line no-unused-vars
import React from "react";
import {Route,Routes} from "react-router-dom";
import Home from "./pages/Home";
import ShowBook from "./pages/ShowBook";
import EditBook from "./pages/EditBook";
import CreateBook from "./pages/CreateBook";
import DeleteBook  from "./pages/DeleteBook";

const App = () => {
    return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/books/create' element={<CreateBook />} />
      <Route path='/books/details/:id' element={<ShowBook />} />
      <Route path='/books/edit/:id' element={<EditBook />} />
      <Route path='/books/delete/:id' element={<DeleteBook />} />
    </Routes>

    );
};

export default App;