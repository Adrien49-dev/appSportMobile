import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // 🟢 Charger les données utilisateur depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("utilisateur_id");
        const storedUserFirstName = await AsyncStorage.getItem("user_first_name");
        const storedUserLastName = await AsyncStorage.getItem("user_last_name");

        console.log("📦 Chargement depuis AsyncStorage:");
        console.log("➡ storedToken:", storedToken);
        console.log("➡ storedUserId:", storedUserId);
        console.log("➡ storedUserFirstName:", storedUserFirstName);
        console.log("➡ storedUserLastName:", storedUserLastName);

        if (storedToken && storedUserId && storedUserFirstName && storedUserLastName) {
          setToken(storedToken);
          setUser({
            utilisateur_id: parseInt(storedUserId, 10) || null, // Vérification
            firstName: storedUserFirstName,
            lastName: storedUserLastName,
            fullName: `${storedUserFirstName} ${storedUserLastName}`,
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
      }
    };

    loadUser();
  }, []);

  // 🟢 Login: Stocker les informations utilisateur correctement
const login = async (userData) => {
  console.log("Données reçues après login:", userData);

  // Vérifie que utilisateur_id est bien défini
  if (!userData.utilisateur_id) {
    console.error("❌ Erreur: utilisateur_id manquant dans la réponse de l'API !");
    return;
  }

  // Stocker les données reçues
  setToken(userData.token);
  setUser({
    utilisateur_id: userData.utilisateur_id,
    firstName: userData.firstName || "Inconnu", // Remplacer si nécessaire
    lastName: userData.lastName || "Inconnu",
    fullName: `${userData.firstName || "Inconnu"} ${userData.lastName || "Inconnu"}`,
  });

  setIsAuthenticated(true);

  // Stocker dans AsyncStorage
  await AsyncStorage.setItem("token", userData.token);
  await AsyncStorage.setItem("utilisateur_id", userData.utilisateur_id.toString());

  console.log("✅ Données stockées dans AsyncStorage !");
};

  // 🟢 Logout: Supprimer toutes les données utilisateur
  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      await AsyncStorage.multiRemove([
        "token",
        "utilisateur_id",
        "user_first_name",
        "user_last_name",
      ]);

      console.log("✅ Déconnexion réussie !");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        utilisateur_id: user?.utilisateur_id,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
