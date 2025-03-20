import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
  Image
} from 'react-native';
import { getSeanceById, getActiviteById, updateSeanceEstTerminee, deleteSeance } from '../services/apiServices';
import { LinearGradient } from 'expo-linear-gradient';

const SeanceDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [seance, setSeance] = useState(null);
  const [activite, setActivite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const fetchSeanceData = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const seanceData = await getSeanceById(id);
      setSeance(seanceData);
  
      // Assurer que estTerminee est un boolean
      const estTerminee = seanceData.estTerminee;
      setIsFinished(estTerminee === true || estTerminee === 'true');
  
      const activiteData = await getActiviteById(seanceData.activite_id);
      setActivite(activiteData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setError('Impossible de charger les détails de la séance');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFinishSeance = async () => {
    try {
      await updateSeanceEstTerminee(id, { estTerminee: true });
      setIsFinished(true);
      Alert.alert("Succès", "Séance marquée comme terminée !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la séance:", error);
    }
  };

  const handleDeleteSeance = async () => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cette séance ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSeance(id);
              navigation.goBack();
            } catch (error) {
              console.error("Erreur lors de la suppression de la séance:", error);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchSeanceData();
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Obtenir une couleur de fond basée sur le type d'activité
  const getActivityColors = () => {
    if (!activite) return ['#4A65FF', '#5E7BFF'];
    
    // Vous pouvez associer des couleurs à des types d'activités spécifiques
    switch(activite.nom.toLowerCase()) {
      case 'course':
      case 'running':
        return ['#FF5757', '#FF8585'];
      case 'natation':
      case 'swimming':
        return ['#56CCF2', '#2D9CDB'];
      case 'cyclisme':
      case 'vélo':
        return ['#27AE60', '#6FCF97'];
      case 'musculation':
      case 'fitness':
        return ['#9B51E0', '#BB6BD9'];
      default:
        return ['#4A65FF', '#5E7BFF'];
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A65FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchSeanceData}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const activityColors = getActivityColors();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={activityColors}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          {activite && (
            <>
              <Text style={styles.activityName}>{activite.nom}</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{seance.duree}</Text>
                  <Text style={styles.statLabel}>minutes</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatDate(seance.date)}</Text>
                  <Text style={styles.statLabel}>date</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.detailsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Détails de la séance</Text>
            {isFinished && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Terminée</Text>
              </View>
            )}
          </View>
          
          <View style={styles.commentSection}>
            <Text style={styles.commentLabel}>Commentaire</Text>
            <View style={styles.commentBox}>
              <Text style={styles.commentText}>{seance.commentaire || 'Aucun commentaire pour cette séance'}</Text>
            </View>
          </View>
  
          {/* Switch pour marquer comme terminé */}
          {!isFinished && (
            <View style={styles.actionSection}>
              <TouchableOpacity 
                style={styles.completeButton} 
                onPress={handleFinishSeance}
              >
                <Text style={styles.completeButtonText}>Marquer comme terminée</Text>
              </TouchableOpacity>
            </View>
          )}
  
          {/* Bouton de suppression */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSeance}>
            <Text style={styles.deleteButtonText}>Supprimer la séance</Text>
          </TouchableOpacity>
        </View>
  
        {activite && activite.description && (
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>À propos de l'activité</Text>
            <View style={styles.activityDescriptionBox}>
              <Text style={styles.activityDescription}>{activite.description}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FD',
  },
  errorText: {
    fontSize: 16,
    color: '#FF5757',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4A65FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingTop: 10,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  activityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 25,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  statDivider: {
    height: 30,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  scrollContent: {
    flex: 1,
    marginTop: -20,
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(39, 174, 96, 0.15)',
    borderRadius: 20,
  },
  statusText: {
    color: '#27AE60',
    fontSize: 12,
    fontWeight: '600',
  },
  commentSection: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
  commentBox: {
    backgroundColor: '#F8F9FD',
    borderRadius: 12,
    padding: 16,
  },
  commentText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  actionSection: {
    marginBottom: 16,
  },
  completeButton: {
    backgroundColor: '#4A65FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 87, 87, 0.1)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF5757',
    fontSize: 16,
    fontWeight: '600',
  },
  activitySection: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  activityDescriptionBox: {
    backgroundColor: '#F8F9FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  activityDescription: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});

export default SeanceDetailScreen;