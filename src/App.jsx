import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./pages/Hero";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import SkinScan from "./pages/SkinScan.jsx";
import Blogs from "./pages/Blogs.jsx";
import Cart from "./pages/Cart.jsx";
import About from "./pages/About.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/skin-scan" element={<SkinScan />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;