import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import styles from './cadastro.module.css';
// import sonic from '../../../public/images/sonnic.jpg'

export function CadastroPage(){
    const navigate = useNavigate();
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <form onSubmit={handleSubmit}>

            <div className={styles.backgroudTotal}>

                <div className={styles.cadastroBox}>
                    <h1>E-Commerce do Jão e seus amigos</h1>
                    <img className={styles.imagem} src="../../../public/images/sonnic.jpg" alt="Logo do sonic"/>
                    <h2>Cadastro</h2>
                </div>

                <div className={styles.formBox}>
                    <label>Nome Completo</label>
                    <input
                        type="text"
                        placeholder="insira seu nome" 
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        />
                </div>

                <div className={styles.formBox}>
                    <label>E-mail</label>
                    <input 
                        type="text" 
                        placeholder="Insira seu e-mail" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                </div>

                <div className={styles.formBox}>
                    <label>Senha</label>
                    <input 
                        type="text" 
                        placeholder="Insira uma senha segura" 
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)}
                        />
                </div>

                <div className={styles.formBox}>
                    <label>Confirmar Senha</label>
                    <input 
                        type="text" 
                        placeholder="Conforme sua senha" 
                        value={confirmarSenha} 
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        />
                </div>
                
            </div>
        </form>
    )
}