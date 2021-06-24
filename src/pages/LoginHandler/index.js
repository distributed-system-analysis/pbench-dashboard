import React from 'react';
import AuthLayout from '@/components/AuthLayout';
import LoginForm from '@/components/LoginForm';

function LoginHandler() {
  return (
    <AuthLayout toPreview={<LoginForm />} heading="Log into your Pbench Account" backOpt="true" />
  );
}

export default LoginHandler;
