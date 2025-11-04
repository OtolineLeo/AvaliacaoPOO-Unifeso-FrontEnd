import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import styles from './cadastro.module.css';

export function CadastroPage(){
    const navigate = useNavigate();
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!nomeCompleto.trim()) {
            newErrors.nomeCompleto = "Nome completo é obrigatório";
        } else if (nomeCompleto.trim().length < 2) {
            newErrors.nomeCompleto = "Nome deve ter pelo menos 2 caracteres";
        }
        
        if (!email.trim()) {
            newErrors.email = "E-mail é obrigatório";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "E-mail inválido";
        }
        
        if (!senha) {
            newErrors.senha = "Senha é obrigatória";
        } else if (senha.length < 6) {
            newErrors.senha = "Senha deve ter pelo menos 6 caracteres";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Dados do cadastro:', { nomeCompleto, email, senha });
            navigate('/');
        } catch (error) {
            setErrors({ submit: 'Erro ao realizar cadastro. Tente novamente.' });
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className={styles.backgroudTotal}>
            <div className={styles.floatingShapes}>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
            </div>
            <div className={styles.container}>
                <header className={styles.cadastroBox}>
                    <div className={styles.logoContainer}>
                        <div className={styles.logoCircle}>
                            <span className={styles.logoIcon}>🛒</span>
                        </div>
                        <h1>Mercadinho Virtual</h1>
                    </div>
                    <h2>Criar Conta</h2>
                </header>

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    {errors.submit && (
                        <div className={styles.errorMessage} role="alert">
                            {errors.submit}
                        </div>
                    )}

                    <div className={styles.formBox}>
                        <label htmlFor="nomeCompleto">Nome Completo *</label>
                        <input
                            id="nomeCompleto"
                            type="text"
                            placeholder="Digite seu nome completo"
                            value={nomeCompleto}
                            onChange={(e) => {
                                setNomeCompleto(e.target.value);
                                if (errors.nomeCompleto) {
                                    setErrors(prev => ({ ...prev, nomeCompleto: '' }));
                                }       
                            }}
                            className={errors.nomeCompleto ? styles.inputError : ''}
                            aria-describedby={errors.nomeCompleto ? 'nomeCompleto-error' : undefined}
                            required
                        />
                        {errors.nomeCompleto && (
                            <span id="nomeCompleto-error" className={styles.fieldError} role="alert">
                                {errors.nomeCompleto}
                            </span>
                        )}
                    </div>

                    <div className={styles.formBox}>
                        <label htmlFor="email">E-mail *</label>
                        <input 
                            id="email"
                            type="email" 
                            placeholder="Digite seu e-mail" 
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) {
                                    setErrors(prev => ({ ...prev, email: '' }));
                                }
                            }}
                            className={errors.email ? styles.inputError : ''}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            required
                        />
                        {errors.email && (
                            <span id="email-error" className={styles.fieldError} role="alert">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className={styles.formBox}>
                        <label htmlFor="senha">Senha *</label>
                        <input 
                            id="senha"
                            type="password" 
                            placeholder="Digite uma senha segura (mín. 6 caracteres)" 
                            value={senha} 
                            onChange={(e) => {
                                setSenha(e.target.value);
                                if (errors.senha) {
                                    setErrors(prev => ({ ...prev, senha: '' }));
                                }
                            }}
                            className={errors.senha ? styles.inputError : ''}
                            aria-describedby={errors.senha ? 'senha-error' : undefined}
                            minLength="6"
                            required
                        />
                        {errors.senha && (
                            <span id="senha-error" className={styles.fieldError} role="alert">
                                {errors.senha}
                            </span>
                        )}
                    </div>

                    <div className={styles.botao}>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                        >
                            <span className={styles.buttonText}>
                                {isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                            </span>
                            {!isLoading && <span className={styles.buttonIcon}>🚀</span>}
                        </button>
                    </div>

                    <div className={styles.loginLink}>
                        <p>
                            Já tem uma conta?{' '}
                            <button 
                                type="button" 
                                onClick={() => navigate('/')}
                                className={styles.linkButton}
                            >
                                Fazer login
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}