import {Routes, Route} from "react-router-dom";
import { CadastroPage } from "../pages/CadastroPage/cadastro";
import { LoginPage } from "../pages/LoginPage/login";
import { HomePage } from "../pages/HomePage/home";
import { CheckoutPage } from "../pages/CheckoutPage/checkout";

export function Rotas(){
    return(
        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/cadastro" element={<CadastroPage/>} />
            <Route path="/home" element={<HomePage/>} />
            <Route path="/checkout" element={<CheckoutPage/>} />
        </Routes>
    )
}