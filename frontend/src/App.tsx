import "styles/globals.css"
import { ThemeProvider } from "./lib/theme-context"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Landingpage } from "./components/pages/landingpage"
import { InformationPage } from "./components/pages/informationPage"
import { Toaster } from "sonner"
import { SpinnerCustom } from "./components/pages/loadercomponent"
import Interviewage from "./components/pages/Interviewpage"



export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/information" element={<InformationPage />} />
          <Route path="/loading-content" element={<SpinnerCustom />} />
          <Route path="/interview" element={<Interviewage/>}/>
        </Routes>
      </BrowserRouter>
      <Toaster/>
    </ThemeProvider>
  );
}

export default App;
