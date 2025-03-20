import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { addSeance, getAllActivites } from '../services/apiServices';
import { AuthContext } from '../context/AuthContext';

const UpdateSeanceScreen = ({ route, navigation }) => {
      const { user } = useContext(AuthContext); // Récupérer l'utilisateur connecté
      const [activites, setActivites] = useState([]); // Stocker les activités
      const [activiteId, setActiviteId] = useState('');
      const [date, setDate] = useState(new Date());
      const [showDatePicker, setShowDatePicker] = useState(false);
      const [duree, setDuree] = useState('');
      const [commentaire, setCommentaire] = useState('');
}