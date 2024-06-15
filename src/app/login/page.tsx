import React from 'react';
import { getFeatures } from '../../shared/api/mainApi/features';
import LoginPage from './LoginPage';

const Login: React.FC = async () => {
  const features = await getFeatures();
  const isRegistrationEnabled = features?.registrationEnabled ?? false;

  return <LoginPage isRegistrationEnabled={isRegistrationEnabled} />;
};

export default Login;
