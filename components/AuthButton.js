import React, { useContext } from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const AuthButton = () => {
  const navigation = useNavigation();
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <Button 
      title={isAuthenticated ? "Se déconnecter" : "Se connecter"} 
      onPress={() => {
        if (isAuthenticated) {
          logout(); 
        } else {
          navigation.navigate('Login'); 
        }
      }} 
    />
  );
};

export default AuthButton;
