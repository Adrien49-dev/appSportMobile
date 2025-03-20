import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchUtilisateurs, addUtilisateur } from '../services/apiServices';

const UtilisateursScreen = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [utilisateurs, setUtilisateurs] = useState([]);
  const navigation = useNavigation();

  // Charger la liste des utilisateurs au montage du composant
  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  const chargerUtilisateurs = async () => {
    try {
      const response = await fetchUtilisateurs();
      setUtilisateurs(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      Alert.alert('Erreur', 'Impossible de charger les utilisateurs.');
    }
  };

  const handleAddUtilisateur = async () => {
    if (!nom || !prenom || !email || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    const utilisateur = { nom, prenom, email, password };

    try {
      await addUtilisateur(utilisateur);
      Alert.alert('Succès', 'Utilisateur ajouté avec succès.');
      
      // Recharger la liste des utilisateurs
      chargerUtilisateurs();

      // Réinitialiser les champs du formulaire
      setNom('');
      setPrenom('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'utilisateur.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Ajouter un utilisateur</Text>
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
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Ajouter" onPress={handleAddUtilisateur} />

      <Text style={styles.subHeader}>Liste des utilisateurs</Text>
      {utilisateurs.length === 0 ? (
        <Text>Aucun utilisateur trouvé.</Text>
      ) : (
        utilisateurs.map((user, index) => (
          <Text key={index} style={styles.userItem}>
            {user.nom} {user.prenom}
          </Text>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 20,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  userItem: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default UtilisateursScreen;
