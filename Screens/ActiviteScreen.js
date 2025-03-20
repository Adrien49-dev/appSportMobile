import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getAllActivites } from '../services/apiServices';

const ActiviteScreen = ({ navigation }) => {
  const [activites, setActivites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivites = async () => {
      try {
        const response = await getAllActivites(); 
        console.log('Réponse API Activités:', response); 

        if (Array.isArray(response)) { 
          setActivites(response);
        } else {
          setError('Format de données incorrect');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des activités :', error);
        setError('Impossible de charger les activités');
      } finally {
        setLoading(false);
      }
    };

    fetchActivites();
  }, []);

  const handleActivitePress = (id) => {
    if (id) {
      navigation.navigate('ActiviteDetails', { id });
    } else {
      console.warn("ID d'activité manquant");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des activités...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Activités</Text>
      {activites.length === 0 && <Text>Aucune activité disponible.</Text>}

      <FlatList
        data={activites}
        keyExtractor={(item, index) => (item.activite_id ? item.activite_id.toString() : index.toString())}
        numColumns={2} // ✅ Afficher 2 colonnes pour un effet "grid"
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.activiteItem} 
            // onPress={() => handleActivitePress(item.activite_id)}
          >
            {/* ✅ Ajout de l'image */}
            <Image 
              source={{ uri: item.image }} 
              style={styles.activiteImage} 
              resizeMode="cover"
            />
            <Text style={styles.activiteText}>{item.nom || 'Nom inconnu'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activiteItem: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // ✅ Ombre sur Android
    alignItems: 'center',
    justifyContent: 'center',
  },
  activiteImage: {
    width: '100%', 
    height: 200, // ✅ Ajuste la hauteur de l'image
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10, 
  },
  activiteText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ActiviteScreen;
