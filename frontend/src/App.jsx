import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home";
import Form from "./components/Form";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-dark text-light w-100 vh-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<Form />} />
          <Route path="/update/:id" element={<Form />} />
        </Routes>
        <Toaster position="bottom-center" />
      </div>
    </BrowserRouter>
  );
}

export default App;
