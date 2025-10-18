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
        <div className={styles.backgroudMain}>
            <h2>Login</h2>

            <div>
                
            </div>

        </div>
        
    )
}
