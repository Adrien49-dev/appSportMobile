import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { addUtilisateur } from '../services/apiServices';
import { useNavigation } from '@react-navigation/native';

const AddUtilisateur = () => {
  const navigation = useNavigation();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddUtilisateur = async () => {
    if (!nom || !prenom || !email || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    setLoading(true);

    const utilisateur = { nom, prenom, email, password };

    try {
      await addUtilisateur(utilisateur);
      Alert.alert('Succès', 'Utilisateur ajouté avec succès.');

      // Réinitialiser les champs
      setNom('');
      setPrenom('');
      setEmail('');
      setPassword('');

      // Rediriger vers l'écran de connexion
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'utilisateur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Créer un compte</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? "Création..." : "Créer un compte"} onPress={handleAddUtilisateur} disabled={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default AddUtilisateur;
