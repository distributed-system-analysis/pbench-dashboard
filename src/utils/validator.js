export const validatePassword = password => {
  return {
    passwordLength: password.length >= 8 ? 'met' : 'unmet',
    passwordSpecialChars: /[`!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password) ? 'met' : 'unmet',
    passwordContainsNumber: /\d/.test(password) ? 'met' : 'unmet',
    passwordBlockLetter: /[A-Z]/.test(password) ? 'met' : 'unmet',
  };
};

export const validateEmail = email => {
  return {
    email: !/\S+@\S+\.\S+/.test(email) ? 'Enter a valid Email' : '',
  };
};
