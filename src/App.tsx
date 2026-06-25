import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Timeline from "@/pages/Timeline";
import Insights from "@/pages/Insights";
import About from "@/pages/About";
import { Navbar } from "@/components/Navbar";
import { WarModal } from "@/components/WarModal";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <WarModal />
    </Router>
  );
}
