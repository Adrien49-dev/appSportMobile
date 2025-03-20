import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Importer DateTimePicker
import { Picker } from '@react-native-picker/picker';
import { addSeance, getAllActivites } from '../services/apiServices';
import { AuthContext } from '../context/AuthContext';

const AddSeanceScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [activites, setActivites] = useState([]);
  const [activiteId, setActiviteId] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duree, setDuree] = useState('');
  const [commentaire, setCommentaire] = useState('');

  useEffect(() => {
    const fetchActivites = async () => {
      try {
        const response = await getAllActivites();
        setActivites(response);
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
      }
    };

    fetchActivites();
  }, []);

  const handleAddSeance = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Utilisateur non connecté.');
      return;
    }

    if (!activiteId || !duree) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const newSeance = {
      utilisateur_id: user.utilisateur_id,
      activite_id: activiteId,
      date: date.toISOString().split('T')[0], // Formater la date
      duree,
      commentaire,
    };

    try {
      await addSeance(newSeance);
      Alert.alert('Succès', 'Séance ajoutée avec succès !');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter la séance.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une Séance</Text>

      {/* Liste déroulante des activités */}
      <Text style={styles.label}>Activité :</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={activiteId} onValueChange={setActiviteId}>
          <Picker.Item label="Sélectionnez une activité" value="" />
          {activites.map((activite) => (
            <Picker.Item key={activite.activite_id} label={activite.nom} value={activite.activite_id} />
          ))}
        </Picker>
      </View>

      {/* Sélection de la date */}
      <Text style={styles.label}>Date :</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
        <Text>{date.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false); // Cacher le date picker après la sélection
            if (selectedDate) {
              setDate(selectedDate); // Mettre à jour la date avec la sélection de l'utilisateur
            }
          }}
        />
      )}

      {/* Champ de durée */}
      <Text style={styles.label}>Durée (en minutes) :</Text>
      <TextInput
        style={styles.input}
        value={duree}
        onChangeText={setDuree}
        keyboardType="numeric"
        placeholder="Durée"
      />

      {/* Champ de commentaire */}
      <Text style={styles.label}>Commentaire :</Text>
      <TextInput
        style={styles.input}
        value={commentaire}
        onChangeText={setCommentaire}
        placeholder="Ajouter un commentaire"
      />

      {/* Bouton de validation */}
      <Button title="Créer Séance" onPress={handleAddSeance} />
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default AddSeanceScreen;
