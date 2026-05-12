import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Main from "@/pages/Main.jsx";
import WriteUps from "@/pages/WriteUps.jsx";
import ReportPage from "@/pages/ReportPage.jsx";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/write-ups" element={<WriteUps />} />
              <Route path="/writeups/:id" element={<ReportPage />} />
          </Routes>
      </Router>
  )
}

export default App
