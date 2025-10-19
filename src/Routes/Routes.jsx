import {Routes, Route} from "react-router-dom";
import { CadastroPage } from "../pages/CadastroPage/cadastro";
import { LoginPage } from "../pages/LoginPage/login"

export function Rotas(){
    return(
        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/cadastro" element={<CadastroPage/>} />
        </Routes>
    )
}