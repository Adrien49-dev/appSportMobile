import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import AuthButton from "../components/AuthButton";
import { LinearGradient } from "expo-linear-gradient";
import { getSeancesByUtilisateur } from "../services/apiServices";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [seancesTerminees, setSeancesTerminees] = useState(0);
  const [seancesAFaire, setSeancesAFaire] = useState(0);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchSeances = async () => {
    setLoading(true);
    try {
      if (user) {
        const data = await getSeancesByUtilisateur(user.utilisateur_id);
        if (data && data.length > 0) {
          setSeancesTerminees(data.filter((seance) => seance.estTerminee === "1").length);
          setSeancesAFaire(data.filter((seance) => seance.estTerminee === "0").length);
        } else {
          setSeancesTerminees(0);
          setSeancesAFaire(0);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des séances", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeances();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#1E3C72", "#2A5298"]} style={styles.header}>
        <Image source={require("../assets/logo/logo.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.welcomeText}>Bonjour {user ? user.fullName : "Sportif"} !</Text>
      </LinearGradient>

      <Animated.View style={[styles.authSection, { opacity: fadeAnim }]}> 
        <AuthButton customStyle={styles.authButton} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        {/* <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Utilisateurs")}> 
          <Text style={styles.menuButtonText}>👤 Gérer les utilisateurs</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Seances")}> 
          <Text style={styles.menuButtonText}>💪 Mes séances</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Activites")}> 
          <Text style={styles.menuButtonText}>🎯 Voir les activités</Text>
        </TouchableOpacity>
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#1E3C72" style={styles.loadingIndicator} />
      ) : (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Vos statistiques</Text>
          <View style={styles.statCards}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{seancesTerminees}</Text>
              <Text style={styles.statLabel}>Séances Terminées</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{seancesAFaire}</Text>
              <Text style={styles.statLabel}>Séances à Faire</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logo: { width: 100, height: 100, marginBottom: 10 },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "white" },
  authSection: { alignItems: "flex-end", paddingHorizontal: 20, paddingVertical: 10 },
  authButton: { borderRadius: 30 },
  menuContainer: { paddingVertical: 30, paddingHorizontal: 20 },
  menuButton: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 50,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonText: { fontSize: 25, fontWeight: "600", color: "#1E3C72" },
  statsContainer: { padding: 20 },
  statsTitle: { fontSize: 25, fontWeight: "600", marginBottom: 15, color: "#333" },
  statCards: { flexDirection: "row", justifyContent: "space-between" },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    width: "45%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "#1E3C72" },
  statLabel: { fontSize: 14, color: "#777", marginTop: 5 },
});

export default HomeScreen;
