import {Routes, Route} from "react-router-dom";
import { CadastroPage } from "../pages/CadastroPage/cadastro";

export function Rotas(){
    return(
        <Routes>
            {/* <Route path="/login" element={<LoginPage/>} /> */}
            <Route path="/cadastro" element={<CadastroPage/>} />
        </Routes>
    )
}