import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import styles from './login.module.css';

export function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [fieldValidation, setFieldValidation] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);

    const validateField = (field, value) => {
        switch(field) {
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'password':
                return value.length >= 6;
            default:
                return true;
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!email.trim()) {
            newErrors.email = "E-mail é obrigatório";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "E-mail inválido";
        }
        
        if (!password) {
            newErrors.password = "Senha é obrigatória";
        } else if (password.length < 6) {
            newErrors.password = "Senha deve ter pelo menos 6 caracteres";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsSuccess(true);
            
            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } catch (error) {
            setErrors({ submit: 'Erro ao fazer login. Tente novamente.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFieldChange = (field, value) => {
        const isValid = validateField(field, value);
        setFieldValidation(prev => ({ ...prev, [field]: isValid }));
        
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    
    return(
        <div className={styles.backgroudMain}>
            <div className={styles.floatingShapes}>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
            </div>
            
            <div className={styles.container}>
                <header className={styles.loginBox}>
                    <div className={styles.logoContainer}>
                        <div className={styles.logoCircle}>
                            <span className={styles.logoIcon}>🔐</span>
                        </div>
                        <h1>Mercadinho Virtual</h1>
                    </div>
                    <h2>Fazer Login</h2>
                </header>

                <form onSubmit={handleSubmit} className={`${styles.form} ${isSuccess ? styles.success : ''}`} noValidate>
                    {isSuccess && (
                        <div className={styles.successMessage}>
                            <div className={styles.successIcon}>✓</div>
                            <h3>Login realizado com sucesso!</h3>
                            <p>Redirecionando...</p>
                        </div>
                    )}

                    {!isSuccess && errors.submit && (
                        <div className={styles.errorMessage} role="alert">
                            {errors.submit}
                        </div>
                    )}

                    {!isSuccess && (
                        <div className={styles.formBox}>
                            <label htmlFor="email">E-mail *</label>
                            <div className={styles.inputContainer}>
                                <span className={styles.inputIcon}>📧</span>
                                <input 
                                    id="email"
                                    type="email" 
                                    placeholder="Digite seu e-mail" 
                                    value={email}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    className={`${errors.email ? styles.inputError : ''} ${fieldValidation.email ? styles.inputValid : ''}`}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    required
                                />
                                {fieldValidation.email && <span className={styles.validIcon}>✓</span>}
                            </div>
                            {errors.email && (
                                <span id="email-error" className={styles.fieldError} role="alert">
                                    {errors.email}
                                </span>
                            )}
                        </div>
                    )}

                    {!isSuccess && (
                        <div className={styles.formBox}>
                            <label htmlFor="password">Senha *</label>
                            <div className={styles.inputContainer}>
                                <span className={styles.inputIcon}>🔒</span>
                                <input 
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha" 
                                    value={password} 
                                    onChange={(e) => handleFieldChange('password', e.target.value)}
                                    className={`${errors.password ? styles.inputError : ''} ${fieldValidation.password ? styles.inputValid : ''}`}
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                    minLength="6"
                                    required
                                />
                                <button 
                                    type="button" 
                                    className={styles.passwordToggle}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {showPassword ? "👁️" : "👁️🗨️"}
                                </button>
                            </div>
                            
                            {errors.password && (
                                <span id="password-error" className={styles.fieldError} role="alert">
                                    {errors.password}
                                </span>
                            )}
                        </div>
                    )}

                    {!isSuccess && (
                        <>
                            <div className={styles.botao}>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                                >
                                    <span className={styles.buttonText}>
                                        {isLoading ? 'Entrando...' : 'Entrar'}
                                    </span>
                                    {!isLoading && <span className={styles.buttonIcon}>🚀</span>}
                                </button>
                            </div>

                            <div className={styles.signupLink}>
                                <p>
                                    Não tem uma conta?{' '}
                                    <button 
                                        type="button" 
                                        onClick={() => navigate('/cadastro')}
                                        className={styles.linkButton}
                                    >
                                        Criar conta
                                    </button>
                                </p>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    )
}