
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidEmailDomain = (email: string): boolean => {
  const domain = email.split('@')[1];
  // Lista de domínios de exemplo que devem ser rejeitados
  const exampleDomains = ['example.com', 'test.com', 'localhost', 'invalid.com'];
  return !exampleDomains.includes(domain);
};

export const getEmailValidationError = (email: string): string | null => {
  if (!email) {
    return 'Email é obrigatório';
  }
  
  if (!validateEmail(email)) {
    return 'Por favor, insira um email válido';
  }
  
  if (!isValidEmailDomain(email)) {
    return 'Por favor, use um email real (não exemplo/teste)';
  }
  
  return null;
};
