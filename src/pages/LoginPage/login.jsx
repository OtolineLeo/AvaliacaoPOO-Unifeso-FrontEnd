import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import styles from './login.module.css';

export function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    
    return(
        <form onSubmit={handleSubmit}>

            <div className={styles.backgroudMain}>

                <h2>Pagina de Login</h2>

                <div className={styles.formBoxLogin}>
                    <h2>Email</h2>
                    <input
                        type="text"
                        placeholder="Insira seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className={styles.formBoxLogin}>
                    <h2>Senha</h2>
                    <input 
                        type="text"
                        placeholder="Insira sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className={styles.botao}>
                    <button type="submit">Entrar</button>
                </div>

            </div>
        </form>
        
    )
}
