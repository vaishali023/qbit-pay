import Home from "./pages/Home";
import "./style.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./layouts/Header";
import TransactionDetails from "./pages/TransactionDetails";
import TransactionList from "./pages/TransactionList";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<TransactionList />} />
        <Route path="/app/transactions/:id" element={<TransactionDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
