import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Orders from "./components/Orders";
import Words from "./components/Words";
import Demo from "./components/Demo";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/words" element={<Words />} />
            <Route path="/demo" element={<Demo />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
