import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './checkout.module.css';

export function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = location.state?.cartItems || [];
    
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [errors, setErrors] = useState({});
    const [fieldValidation, setFieldValidation] = useState({});

    // Dados do cliente
    const [customerData, setCustomerData] = useState({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        birthDate: ''
    });

    // Endereço de entrega
    const [addressData, setAddressData] = useState({
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
    });

    // Dados de pagamento
    const [paymentData, setPaymentData] = useState({
        method: 'credit',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        installments: '1'
    });

    const validateField = (field, value, section) => {
        switch(field) {
            case 'name': return value.trim().length >= 2;
            case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'phone': return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value);
            case 'cpf': return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value);
            case 'cep': return /^\d{5}-\d{3}$/.test(value);
            case 'cardNumber': return /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(value);
            case 'cvv': return /^\d{3,4}$/.test(value);
            default: return value.trim().length > 0;
        }
    };

    const handleFieldChange = (field, value, section) => {
        const isValid = validateField(field, value, section);
        setFieldValidation(prev => ({ ...prev, [`${section}.${field}`]: isValid }));
        
        if (section === 'customer') {
            setCustomerData(prev => ({ ...prev, [field]: value }));
        } else if (section === 'address') {
            setAddressData(prev => ({ ...prev, [field]: value }));
        } else if (section === 'payment') {
            setPaymentData(prev => ({ ...prev, [field]: value }));
        }
        
        if (errors[`${section}.${field}`]) {
            setErrors(prev => ({ ...prev, [`${section}.${field}`]: '' }));
        }
    };

    const formatInput = (value, type) => {
        switch(type) {
            case 'phone':
                return value.replace(/\D/g, '').replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
            case 'cpf':
                return value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            case 'cep':
                return value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
            case 'cardNumber':
                return value.replace(/\D/g, '').replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
            case 'expiryDate':
                return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
            default:
                return value;
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 1) {
            if (!customerData.name.trim()) newErrors['customer.name'] = 'Nome é obrigatório';
            if (!customerData.email.trim()) newErrors['customer.email'] = 'E-mail é obrigatório';
            if (!customerData.phone.trim()) newErrors['customer.phone'] = 'Telefone é obrigatório';
            if (!customerData.cpf.trim()) newErrors['customer.cpf'] = 'CPF é obrigatório';
        } else if (step === 2) {
            if (!addressData.cep.trim()) newErrors['address.cep'] = 'CEP é obrigatório';
            if (!addressData.street.trim()) newErrors['address.street'] = 'Rua é obrigatória';
            if (!addressData.number.trim()) newErrors['address.number'] = 'Número é obrigatório';
            if (!addressData.neighborhood.trim()) newErrors['address.neighborhood'] = 'Bairro é obrigatório';
            if (!addressData.city.trim()) newErrors['address.city'] = 'Cidade é obrigatória';
            if (!addressData.state.trim()) newErrors['address.state'] = 'Estado é obrigatório';
        } else if (step === 3) {
            if (paymentData.method === 'credit') {
                if (!paymentData.cardNumber.trim()) newErrors['payment.cardNumber'] = 'Número do cartão é obrigatório';
                if (!paymentData.cardName.trim()) newErrors['payment.cardName'] = 'Nome no cartão é obrigatório';
                if (!paymentData.expiryDate.trim()) newErrors['payment.expiryDate'] = 'Data de validade é obrigatória';
                if (!paymentData.cvv.trim()) newErrors['payment.cvv'] = 'CVV é obrigatório';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const generateInvoicePDF = (orderNumber) => {
        const invoiceContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Nota Fiscal - ${orderNumber}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                    .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; text-align: center; margin-bottom: 20px; }
                    .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                    .company-info { font-size: 12px; }
                    .invoice-title { text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
                    .section { margin: 20px 0; }
                    .section-title { font-weight: bold; font-size: 14px; margin-bottom: 10px; color: #667eea; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    .products-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    .products-table th, .products-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .products-table th { background-color: #f8fafc; }
                    .total-section { background: #f8fafc; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-name">🛒 E-COMMERCE UNIFESO</div>
                    <div class="company-info">CNPJ: 12.345.678/0001-90 | IE: 123.456.789</div>
                </div>
                
                <div class="invoice-title">NOTA FISCAL ELETRÔNICA</div>
                
                <div class="section">
                    <div class="section-title">INFORMAÇÕES DO PEDIDO</div>
                    <p><strong>Número:</strong> ${orderNumber}</p>
                    <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
                    <p><strong>Hora:</strong> ${new Date().toLocaleTimeString('pt-BR')}</p>
                </div>
                
                <div class="info-grid">
                    <div class="section">
                        <div class="section-title">DADOS DO CLIENTE</div>
                        <p><strong>Nome:</strong> ${customerData.name}</p>
                        <p><strong>E-mail:</strong> ${customerData.email}</p>
                        <p><strong>CPF:</strong> ${customerData.cpf}</p>
                        <p><strong>Telefone:</strong> ${customerData.phone}</p>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">ENDEREÇO DE ENTREGA</div>
                        <p>${addressData.street}, ${addressData.number}</p>
                        ${addressData.complement ? `<p>Complemento: ${addressData.complement}</p>` : ''}
                        <p>${addressData.neighborhood} - ${addressData.city}/${addressData.state}</p>
                        <p>CEP: ${addressData.cep}</p>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">PRODUTOS</div>
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Qtd</th>
                                <th>Valor Unit.</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cartItems.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                                    <td>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <div class="section-title">FORMA DE PAGAMENTO</div>
                    <p>${paymentData.method === 'credit' ? `Cartão de Crédito - ${paymentData.installments}x` : 'PIX - Pagamento à vista'}</p>
                </div>
                
                <div class="total-section">
                    TOTAL GERAL: R$ ${getTotalPrice().toFixed(2).replace('.', ',')}
                </div>
                
                <div class="footer">
                    <p>Obrigado pela preferência! Volte sempre!</p>
                    <p>www.ecommerce-unifeso.com.br | contato@unifeso.edu.br</p>
                </div>
            </body>
            </html>
        `;
        
        const newWindow = window.open('', '_blank');
        newWindow.document.write(invoiceContent);
        newWindow.document.close();
        
        setTimeout(() => {
            newWindow.print();
        }, 500);
    };

    const processOrder = async () => {
        if (!validateStep(3)) return;
        
        setIsProcessing(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const orderNumber = `#PED${Date.now().toString().slice(-6)}`;
            generateInvoicePDF(orderNumber);
            setOrderComplete(true);
            setCurrentStep(4);
        } catch (error) {
            setErrors({ submit: 'Erro ao processar pedido. Tente novamente.' });
        } finally {
            setIsProcessing(false);
        }
    };

    const renderStepIndicator = () => (
        <div className={styles.stepIndicator}>
            {[1, 2, 3, 4].map(step => (
                <div key={step} className={styles.stepContainer}>
                    <div className={`${styles.stepCircle} ${currentStep >= step ? styles.active : ''} ${currentStep > step ? styles.completed : ''}`}>
                        {currentStep > step ? '✓' : step}
                    </div>
                    <span className={styles.stepLabel}>
                        {step === 1 && 'Dados'}
                        {step === 2 && 'Entrega'}
                        {step === 3 && 'Pagamento'}
                        {step === 4 && 'Confirmação'}
                    </span>
                    {step < 4 && <div className={`${styles.stepLine} ${currentStep > step ? styles.completed : ''}`}></div>}
                </div>
            ))}
        </div>
    );

    if (cartItems.length === 0) {
        return (
            <div className={styles.checkoutContainer}>
                <div className={styles.emptyCart}>
                    <span className={styles.emptyIcon}>🛒</span>
                    <h2>Carrinho vazio</h2>
                    <p>Adicione produtos ao carrinho para finalizar a compra</p>
                    <button onClick={() => navigate('/home')} className={styles.backButton}>
                        Voltar às compras
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.checkoutContainer}>
            <div className={styles.floatingShapes}>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
            </div>

            <div className={styles.checkoutContent}>
                <header className={styles.checkoutHeader}>
                    <div className={styles.logoSection}>
                        <div className={styles.logoCircle}>
                            <span className={styles.logoIcon}>🛒</span>
                        </div>
                        <h1>Finalizar Compra</h1>
                    </div>
                    {renderStepIndicator()}
                </header>

                <div className={styles.checkoutMain}>
                    <div className={styles.formSection}>
                        {currentStep === 1 && (
                            <div className={styles.stepContent}>
                                <h2>Dados Pessoais</h2>
                                <div className={styles.formGrid}>
                                    <div className={styles.formBox}>
                                        <label>Nome Completo *</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>👤</span>
                                            <input
                                                type="text"
                                                placeholder="Digite seu nome completo"
                                                value={customerData.name}
                                                onChange={(e) => handleFieldChange('name', e.target.value, 'customer')}
                                                className={errors['customer.name'] ? styles.inputError : fieldValidation['customer.name'] ? styles.inputValid : ''}
                                            />
                                            {fieldValidation['customer.name'] && <span className={styles.validIcon}>✓</span>}
                                        </div>
                                        {errors['customer.name'] && <span className={styles.fieldError}>{errors['customer.name']}</span>}
                                    </div>

                                    <div className={styles.formBox}>
                                        <label>E-mail *</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>📧</span>
                                            <input
                                                type="email"
                                                placeholder="Digite seu e-mail"
                                                value={customerData.email}
                                                onChange={(e) => handleFieldChange('email', e.target.value, 'customer')}
                                                className={errors['customer.email'] ? styles.inputError : fieldValidation['customer.email'] ? styles.inputValid : ''}
                                            />
                                            {fieldValidation['customer.email'] && <span className={styles.validIcon}>✓</span>}
                                        </div>
                                        {errors['customer.email'] && <span className={styles.fieldError}>{errors['customer.email']}</span>}
                                    </div>

                                    <div className={styles.formBox}>
                                        <label>Telefone *</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>📱</span>
                                            <input
                                                type="text"
                                                placeholder="(11) 99999-9999"
                                                value={customerData.phone}
                                                onChange={(e) => handleFieldChange('phone', formatInput(e.target.value, 'phone'), 'customer')}
                                                className={errors['customer.phone'] ? styles.inputError : fieldValidation['customer.phone'] ? styles.inputValid : ''}
                                            />
                                            {fieldValidation['customer.phone'] && <span className={styles.validIcon}>✓</span>}
                                        </div>
                                        {errors['customer.phone'] && <span className={styles.fieldError}>{errors['customer.phone']}</span>}
                                    </div>

                                    <div className={styles.formBox}>
                                        <label>CPF *</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>🆔</span>
                                            <input
                                                type="text"
                                                placeholder="000.000.000-00"
                                                value={customerData.cpf}
                                                onChange={(e) => handleFieldChange('cpf', formatInput(e.target.value, 'cpf'), 'customer')}
                                                className={errors['customer.cpf'] ? styles.inputError : fieldValidation['customer.cpf'] ? styles.inputValid : ''}
                                            />
                                            {fieldValidation['customer.cpf'] && <span className={styles.validIcon}>✓</span>}
                                        </div>
                                        {errors['customer.cpf'] && <span className={styles.fieldError}>{errors['customer.cpf']}</span>}
                                    </div>

                                    <div className={styles.formBox}>
                                        <label>Data de Nascimento</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>📅</span>
                                            <input
                                                type="date"
                                                value={customerData.birthDate}
                                                onChange={(e) => handleFieldChange('birthDate', e.target.value, 'customer')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className={styles.stepContent}>
                                <h2>Endereço de Entrega</h2>
                                <div className={styles.formGrid}>
                                    <div className={styles.formBox}>
                                        <label>CEP *</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>📍</span>
                                            <input
                                                type="text"
                                                placeholder="00000-000"
                                                value={addressData.cep}
                                                onChange={(e) => handleFieldChange('cep', formatInput(e.target.value, 'cep'), 'address')}
                                                className={errors['address.cep'] ? styles.inputError : fieldValidation['address.cep'] ? styles.inputValid : ''}
                                            />
                                            {fieldValidation['address.cep'] && <span className={styles.validIcon}>✓</span>}
                                        </div>
                                        {errors['address.cep'] && <span className={styles.fieldError}>{errors['address.cep']}</span>}
                                    </div>

                                    <div className={styles.formBox}>
                                        <label>Rua *</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>🏠</span>
                                            <input
                                                type="text"
                                                placeholder="Nome da rua"
                                                value={addressData.street}
                                                onChange={(e) => handleFieldChange('street', e.target.value, 'address')}
                                                className={errors['address.street'] ? styles.inputError : fieldValidation['address.street'] ? styles.inputValid : ''}
                                            />
                                            {fieldValidation['address.street'] && <span className={styles.validIcon}>✓</span>}
                                        </div>
                                        {errors['address.street'] && <span className={styles.fieldError}>{errors['address.street']}</span>}
                                    </div>

                                    <div className={styles.formBox}>
                                        <label>Número *</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>🔢</span>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={addressData.number}
                                                onChange={(e) => handleFieldChange('number', e.target.value, 'address')}
                                                className={errors['address.number'] ? styles.inputError : fieldValidation['address.number'] ? styles.inputValid : ''}
                                            />
                                            {fieldValidation['address.number'] && <span className={styles.validIcon}>✓</span>}
                                        </div>
                                        {errors['address.number'] && <span className={styles.fieldError}>{errors['address.number']}</span>}
                                    </div>

                                    <div className={styles.formBox}>
                                        <label>Complemento</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>🏢</span>
                                            <input
                                                type="text"
                                                placeholder="Apto, bloco, etc."
                                                value={addressData.complement}
                                                onChange={(e) => handleFieldChange('complement', e.target.value, 'address')}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formBox}>
                                        <label>Bairro *</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>🏘️</span>
                                            <input
                                                type="text"
                                                placeholder="Nome do bairro"
                                                value={addressData.neighborhood}
                                                onChange={(e) => handleFieldChange('neighborhood', e.target.value, 'address')}
                                                className={errors['address.neighborhood'] ? styles.inputError : fieldValidation['address.neighborhood'] ? styles.inputValid : ''}
                                            />
                                            {fieldValidation['address.neighborhood'] && <span className={styles.validIcon}>✓</span>}
                                        </div>
                                        {errors['address.neighborhood'] && <span className={styles.fieldError}>{errors['address.neighborhood']}</span>}
                                    </div>

                                    <div className={styles.formBox}>
                                        <label>Cidade *</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>🏙️</span>
                                            <input
                                                type="text"
                                                placeholder="Nome da cidade"
                                                value={addressData.city}
                                                onChange={(e) => handleFieldChange('city', e.target.value, 'address')}
                                                className={errors['address.city'] ? styles.inputError : fieldValidation['address.city'] ? styles.inputValid : ''}
                                            />
                                            {fieldValidation['address.city'] && <span className={styles.validIcon}>✓</span>}
                                        </div>
                                        {errors['address.city'] && <span className={styles.fieldError}>{errors['address.city']}</span>}
                                    </div>

                                    <div className={styles.formBox}>
                                        <label>Estado *</label>
                                        <div className={styles.inputContainer}>
                                            <span className={styles.inputIcon}>🗺️</span>
                                            <select
                                                value={addressData.state}
                                                onChange={(e) => handleFieldChange('state', e.target.value, 'address')}
                                                className={errors['address.state'] ? styles.inputError : fieldValidation['address.state'] ? styles.inputValid : ''}
                                            >
                                                <option value="">Selecione o estado</option>
                                                <option value="RJ">Rio de Janeiro</option>
                                                <option value="SP">São Paulo</option>
                                                <option value="MG">Minas Gerais</option>
                                                <option value="ES">Espírito Santo</option>
                                            </select>
                                            {fieldValidation['address.state'] && <span className={styles.validIcon}>✓</span>}
                                        </div>
                                        {errors['address.state'] && <span className={styles.fieldError}>{errors['address.state']}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className={styles.stepContent}>
                                <h2>Forma de Pagamento</h2>
                                
                                <div className={styles.paymentMethods}>
                                    <div className={`${styles.paymentOption} ${paymentData.method === 'credit' ? styles.selected : ''}`}
                                         onClick={() => handleFieldChange('method', 'credit', 'payment')}>
                                        <span className={styles.paymentIcon}>💳</span>
                                        <span>Cartão de Crédito</span>
                                    </div>
                                    <div className={`${styles.paymentOption} ${paymentData.method === 'pix' ? styles.selected : ''}`}
                                         onClick={() => handleFieldChange('method', 'pix', 'payment')}>
                                        <span className={styles.paymentIcon}>📱</span>
                                        <span>PIX</span>
                                    </div>
                                </div>

                                {paymentData.method === 'credit' && (
                                    <div className={styles.formGrid}>
                                        <div className={styles.formBox}>
                                            <label>Número do Cartão *</label>
                                            <div className={styles.inputContainer}>
                                                <span className={styles.inputIcon}>💳</span>
                                                <input
                                                    type="text"
                                                    placeholder="0000 0000 0000 0000"
                                                    value={paymentData.cardNumber}
                                                    onChange={(e) => handleFieldChange('cardNumber', formatInput(e.target.value, 'cardNumber'), 'payment')}
                                                    className={errors['payment.cardNumber'] ? styles.inputError : fieldValidation['payment.cardNumber'] ? styles.inputValid : ''}
                                                />
                                                {fieldValidation['payment.cardNumber'] && <span className={styles.validIcon}>✓</span>}
                                            </div>
                                            {errors['payment.cardNumber'] && <span className={styles.fieldError}>{errors['payment.cardNumber']}</span>}
                                        </div>

                                        <div className={styles.formBox}>
                                            <label>Nome no Cartão *</label>
                                            <div className={styles.inputContainer}>
                                                <span className={styles.inputIcon}>👤</span>
                                                <input
                                                    type="text"
                                                    placeholder="Nome como no cartão"
                                                    value={paymentData.cardName}
                                                    onChange={(e) => handleFieldChange('cardName', e.target.value.toUpperCase(), 'payment')}
                                                    className={errors['payment.cardName'] ? styles.inputError : fieldValidation['payment.cardName'] ? styles.inputValid : ''}
                                                />
                                                {fieldValidation['payment.cardName'] && <span className={styles.validIcon}>✓</span>}
                                            </div>
                                            {errors['payment.cardName'] && <span className={styles.fieldError}>{errors['payment.cardName']}</span>}
                                        </div>

                                        <div className={styles.formBox}>
                                            <label>Validade *</label>
                                            <div className={styles.inputContainer}>
                                                <span className={styles.inputIcon}>📅</span>
                                                <input
                                                    type="text"
                                                    placeholder="MM/AA"
                                                    value={paymentData.expiryDate}
                                                    onChange={(e) => handleFieldChange('expiryDate', formatInput(e.target.value, 'expiryDate'), 'payment')}
                                                    className={errors['payment.expiryDate'] ? styles.inputError : fieldValidation['payment.expiryDate'] ? styles.inputValid : ''}
                                                />
                                                {fieldValidation['payment.expiryDate'] && <span className={styles.validIcon}>✓</span>}
                                            </div>
                                            {errors['payment.expiryDate'] && <span className={styles.fieldError}>{errors['payment.expiryDate']}</span>}
                                        </div>

                                        <div className={styles.formBox}>
                                            <label>CVV *</label>
                                            <div className={styles.inputContainer}>
                                                <span className={styles.inputIcon}>🔒</span>
                                                <input
                                                    type="text"
                                                    placeholder="000"
                                                    value={paymentData.cvv}
                                                    onChange={(e) => handleFieldChange('cvv', e.target.value.replace(/\D/g, ''), 'payment')}
                                                    className={errors['payment.cvv'] ? styles.inputError : fieldValidation['payment.cvv'] ? styles.inputValid : ''}
                                                />
                                                {fieldValidation['payment.cvv'] && <span className={styles.validIcon}>✓</span>}
                                            </div>
                                            {errors['payment.cvv'] && <span className={styles.fieldError}>{errors['payment.cvv']}</span>}
                                        </div>

                                        <div className={styles.formBox}>
                                            <label>Parcelas</label>
                                            <div className={styles.inputContainer}>
                                                <span className={styles.inputIcon}>💰</span>
                                                <select
                                                    value={paymentData.installments}
                                                    onChange={(e) => handleFieldChange('installments', e.target.value, 'payment')}
                                                >
                                                    <option value="1">1x de R$ {getTotalPrice().toFixed(2).replace('.', ',')}</option>
                                                    <option value="2">2x de R$ {(getTotalPrice() / 2).toFixed(2).replace('.', ',')}</option>
                                                    <option value="3">3x de R$ {(getTotalPrice() / 3).toFixed(2).replace('.', ',')}</option>
                                                    <option value="6">6x de R$ {(getTotalPrice() / 6).toFixed(2).replace('.', ',')}</option>
                                                    <option value="12">12x de R$ {(getTotalPrice() / 12).toFixed(2).replace('.', ',')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentData.method === 'pix' && (
                                    <div className={styles.pixInfo}>
                                        <div className={styles.pixIcon}>📱</div>
                                        <h3>Pagamento via PIX</h3>
                                        <p>Após confirmar o pedido, você receberá o código PIX para pagamento</p>
                                        <div className={styles.pixAdvantages}>
                                            <span>✅ Aprovação instantânea</span>
                                            <span>✅ Sem taxas</span>
                                            <span>✅ Disponível 24h</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep === 4 && orderComplete && (
                            <div className={styles.stepContent}>
                                <div className={styles.successMessage}>
                                    <div className={styles.successIcon}>✅</div>
                                    <h2>Pedido Confirmado!</h2>
                                    <p>Seu pedido foi processado com sucesso</p>
                                    <div className={styles.orderNumber}>
                                        Número do pedido: <strong>#PED{Date.now().toString().slice(-6)}</strong>
                                    </div>
                                    <p style={{color: '#38a169', fontWeight: '600', marginBottom: '1rem'}}>✅ Nota fiscal gerada automaticamente</p>
                                    <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                                        <button 
                                            onClick={() => {
                                                const orderNumber = `#PED${Date.now().toString().slice(-6)}`;
                                                generateInvoicePDF(orderNumber);
                                            }} 
                                            className={styles.continueButton}
                                            style={{background: 'linear-gradient(135deg, #38a169, #48bb78)'}}
                                        >
                                            🖨️ Imprimir Nota Fiscal
                                        </button>
                                        <button 
                                            onClick={() => navigate('/home')} 
                                            className={styles.continueButton}
                                        >
                                            Continuar Comprando
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep < 4 && (
                            <div className={styles.stepActions}>
                                {currentStep > 1 && (
                                    <button onClick={prevStep} className={styles.prevButton}>
                                        ← Voltar
                                    </button>
                                )}
                                {currentStep < 3 && (
                                    <button onClick={nextStep} className={styles.nextButton}>
                                        Continuar →
                                    </button>
                                )}
                                {currentStep === 3 && (
                                    <button 
                                        onClick={processOrder} 
                                        disabled={isProcessing}
                                        className={`${styles.finishButton} ${isProcessing ? styles.processing : ''}`}
                                    >
                                        {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.orderSummary}>
                        <h3>Resumo do Pedido</h3>
                        <div className={styles.orderItems}>
                            {cartItems.map(item => (
                                <div key={item.id} className={styles.orderItem}>
                                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                                    <div className={styles.itemInfo}>
                                        <h4>{item.name}</h4>
                                        <p>Qtd: {item.quantity}</p>
                                        <span className={styles.itemPrice}>
                                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.orderTotal}>
                            <div className={styles.totalLine}>
                                <span>Subtotal:</span>
                                <span>R$ {getTotalPrice().toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className={styles.totalLine}>
                                <span>Frete:</span>
                                <span className={styles.freeShipping}>Grátis</span>
                            </div>
                            <div className={styles.totalLine}>
                                <strong>Total: R$ {getTotalPrice().toFixed(2).replace('.', ',')}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}