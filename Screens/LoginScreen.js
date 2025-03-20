import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(
        "https://www.cefii-developpements.fr/adrien1467/AppSportMobile/API/Public/index.php?controller=Utilisateur&action=loginUtilisateur",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
  
      const data = await response.json();
      console.log("🔍 Réponse API Login:", data);
  
      if (response.ok) {
        const token = data.token;
        const utilisateurId = data.utilisateur_id;
  
        if (!utilisateurId) {
          Alert.alert("Erreur", "Utilisateur ID manquant.");
          return;
        }
  
        const userDetailsResponse = await fetch(
          `https://www.cefii-developpements.fr/adrien1467/AppSportMobile/API/Public/index.php?controller=Utilisateur&action=getUtilisateurById&id=${utilisateurId}`,
          {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
          }
        );
  
        const userDetails = await userDetailsResponse.json();
        console.log("🔍 Réponse API User Details:", userDetails);
  
        if (userDetailsResponse.ok) {
          login({
            token: token,
            utilisateur_id: utilisateurId,
            firstName: userDetails.prenom, 
            lastName: userDetails.nom, 
          });
          navigation.navigate("Home");
        } else {
          Alert.alert("Erreur", "Impossible de récupérer les informations de l'utilisateur.");
        }
      } else {
        Alert.alert("Erreur", data.error || "Connexion échouée.");
      }
    } catch (error) {
      console.error("❌ Erreur de connexion:", error);
      Alert.alert("Erreur", "Problème de connexion. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      
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
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Connexion..." : "Se connecter"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("AddUtilisateur")}>
        <Text style={styles.registerButtonText}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 15,
  },
  registerButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
