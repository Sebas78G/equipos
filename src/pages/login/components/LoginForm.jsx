import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { Checkbox } from 'components/ui/Checkbox';
import Icon from 'components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Mock credentials for authentication
  const mockCredentials = {
    email: 'admin@expresoviajes.com',
    password: 'Admin123!'
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validatePassword = (password) => {
    return password?.length >= 6;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));

    // Clear errors when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error when user modifies form
    if (authError) {
      setAuthError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Por favor ingrese un correo electrónico válido';
    }

    if (!formData?.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(formData?.password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthError('');

    // Simulate API call delay
    setTimeout(() => {
      if (
        formData?.email === mockCredentials?.email && 
        formData?.password === mockCredentials?.password
      ) {
        // Store user session
        localStorage.setItem('userSession', JSON.stringify({
          email: formData?.email,
          name: 'Admin',
          role: 'Administrador',
          loginTime: new Date()?.toISOString(),
          rememberMe: formData?.rememberMe
        }));
        
        navigate('/main-dashboard');
      } else {
        setAuthError('Credenciales incorrectas. Use: admin@expresoviajes.com / Admin123!');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña próximamente disponible');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <Input
          label="Correo Electrónico"
          type="email"
          name="email"
          placeholder="admin@expresoviajes.com"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
          className="w-full"
        />

        {/* Password Input */}
        <Input
          label="Contraseña"
          type="password"
          name="password"
          placeholder="Ingrese su contraseña"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          disabled={isLoading}
          className="w-full"
        />

        {/* Remember Me Checkbox */}
        <Checkbox
          label="Recordar mis credenciales"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
          disabled={isLoading}
          className="flex items-center space-x-2"
        />

        {/* Authentication Error */}
        {authError && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
              <p className="text-sm text-error font-medium">{authError}</p>
            </div>
          </div>
        )}

        {/* Login Button */}
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          disabled={isLoading}
          fullWidth
          iconName={isLoading ? undefined : "LogIn"}
          iconPosition="left"
          className="w-full"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={handleForgotPassword}
            disabled={isLoading}
            className="text-sm text-primary hover:text-primary/80"
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;