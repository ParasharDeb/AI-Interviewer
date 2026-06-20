import "styles/globals.css"
import { ThemeProvider } from "./lib/theme-context"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Landingpage } from "./components/pages/landingpage"
import { Interviewpage } from "./components/pages/Interviewpage"
import { Toaster } from "sonner"


export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/interview" element={<Interviewpage />} />
          
        </Routes>
      </BrowserRouter>
      <Toaster/>
    </ThemeProvider>
  );
}

export default App;
