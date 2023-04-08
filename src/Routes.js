import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import Knowledge from './components/Knowledge'
const App=()=>{
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/knowledge" element={<Knowledge />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
