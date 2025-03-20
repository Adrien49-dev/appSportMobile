import React, { useEffect, useState, useContext, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  StatusBar,
  Dimensions
} from 'react-native';
import { getSeancesByUtilisateur } from '../services/apiServices';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SeancesScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [seances, setSeances] = useState([]);
  const [filteredSeances, setFilteredSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'finished', 'toDo'

  const fetchSeances = useCallback(async () => {
    if (!user) {
      setError('Aucun utilisateur connecté.');
      setLoading(false);
      return;
    }
  
    try {
      const data = await getSeancesByUtilisateur(user.utilisateur_id);
      setSeances(data);
      setFilteredSeances(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des séances:', error);
      setError('Impossible de charger les séances');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSeances();
  }, [fetchSeances]);

  const filterSeances = (filterType) => {
    setFilter(filterType);
    if (filterType === 'finished') {
      setFilteredSeances(seances.filter(seance => seance.estTerminee === '1'));
    } else if (filterType === 'toDo') {
      setFilteredSeances(seances.filter(seance => seance.estTerminee === '0'));
    } else {
      setFilteredSeances(seances);
    }
  };

  const handleSeancePress = (id) => {
    navigation.navigate('SeanceDetails', { id });
  };

  // Obtenir l'icône appropriée pour le type d'activité
  const getActivityIcon = (activityName) => {
    // Vous pouvez personnaliser cette logique selon vos activités
    const activityType = activityName.toLowerCase();
    
    if (activityType.includes('course') || activityType.includes('jogging')) {
      return 'walk';
    } else if (activityType.includes('velo') || activityType.includes('vélo')) {
      return 'bicycle';
    } else if (activityType.includes('natation')) {
      return 'water';
    } else if (activityType.includes('muscu')) {
      return 'barbell';
    }
    else if (activityType.includes('yoga')) {
      return 'fitness';
    }
    
    return 'pulse'; // icône par défaut
  };

  const renderSeanceItem = ({ item }) => {
    const isFinished = item.estTerminee === '1';
    const activityIcon = getActivityIcon(item.activite_nom);
    
    return (
      <TouchableOpacity
        style={styles.seanceItem}
        onPress={() => handleSeancePress(item.id)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isFinished ? ['#28a745', '#1e7e34'] : ['#0099cc', '#006699']}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={activityIcon} size={28} color="#fff" />
          </View>
          
          <View style={styles.seanceContent}>
            <Text style={styles.seanceTitle}>{item.activite_nom}</Text>
            <View style={styles.seanceDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar" size={16} color="#fff" style={styles.detailIcon} />
                <Text style={styles.seanceText}>{item.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time" size={16} color="#fff" style={styles.detailIcon} />
                <Text style={styles.seanceText}>{item.duree} min</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <Ionicons 
              name={isFinished ? "checkmark-circle" : "timer"} 
              size={24} 
              color="#fff" 
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0099cc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons name="alert-circle" size={60} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchSeances();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Séances</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.activeFilterButton]}
          onPress={() => filterSeances('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.activeFilterText]}>Toutes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'finished' && styles.activeFilterButton]}
          onPress={() => filterSeances('finished')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterButtonText, filter === 'finished' && styles.activeFilterText]}>Terminées</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'toDo' && styles.activeFilterButton]}
          onPress={() => filterSeances('toDo')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterButtonText, filter === 'toDo' && styles.activeFilterText]}>À faire</Text>
        </TouchableOpacity>
      </View>

      {filteredSeances.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color="#cccccc" />
          <Text style={styles.emptyText}>Aucune séance trouvée</Text>
          <Text style={styles.emptySubtext}>Ajoutez une nouvelle séance pour commencer</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSeances}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSeanceItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddSeance')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#0099cc', '#006699']}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Nouvelle séance</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: width / 3.5,
    alignItems: 'center',
    elevation: 1,
  },
  activeFilterButton: {
    backgroundColor: '#0099cc',
    elevation: 3,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  seanceItem: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradientContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  seanceContent: {
    flex: 1,
  },
  seanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  seanceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  detailIcon: {
    marginRight: 4,
  },
  seanceText: {
    fontSize: 14,
    color: '#fff',
  },
  statusContainer: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#0099cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  }
});

export default SeancesScreen;