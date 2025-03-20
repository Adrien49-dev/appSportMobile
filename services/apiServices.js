import axios from "axios";
import { AuthContext } from '../context/AuthContext'; 

// GERER LES UTILISATEURS

// const API_URL = 'https://www.cefii-developpements.fr/adrien1467/AppSportMobile/API/Public/index.php?controller=Utilisateur&action=getAllUtilisateurs';

export const fetchUtilisateurs = () => {
  return axios.get(
    "https://www.cefii-developpements.fr/adrien1467/AppSportMobile/API/Public/index.php?controller=Utilisateur&action=getAllUtilisateurs"
  );
};

export const addUtilisateur = (utilisateur) => {
  return axios.post(
    "https://www.cefii-developpements.fr/adrien1467/AppSportMobile/API/Public/index.php?controller=Utilisateur&action=addUtilisateur",
    utilisateur
  );
};

// GERER LES ACTIVITES

const BASE_URL =
  "https://www.cefii-developpements.fr/adrien1467/AppSportMobile/API/Public/index.php";

// Fonction pour récupérer toutes les activités
export const getAllActivites = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}?controller=ActiviteSportive&action=getAllActivites`
    );
    return response.data; // Retourne les données récupérées de l'API
  } catch (error) {
    console.error("Erreur lors de la récupération des activités :", error);
    throw error; // Lancer l'erreur pour pouvoir la capturer dans les composants
  }
};

// Fonction pour récupérer une activité par son ID
export const getActiviteById = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?controller=ActiviteSportive&action=getActiviteById&id=${id}`
    );
    return response.data; // Retourne l'activité demandée
  } catch (error) {
    console.error("Erreur lors de la récupération de l'activité :", error);
    throw error;
  }
};

// Fonction pour ajouter une nouvelle activité
export const addActivite = async (nom) => {
  try {
    const response = await axios.post(
      `${BASE_URL}?controller=ActiviteSportive&action=addActivite`,
      {
        nom: nom,
      }
    );
    return response.data; // Retourne le message de confirmation
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'activité :", error);
    throw error;
  }
};

// GERER LES SEANCES

const baseURL =
  "https://www.cefii-developpements.fr/adrien1467/AppSportMobile/API/Public/index.php?controller=SeanceSportive&action=";

// Fonction pour récupérer toutes les séances
export const getAllSeances = async () => {
  try {
    const response = await axios.get(`${baseURL}getAllSeances`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des séances:", error);
    throw error;
  }
};

// Fonction pour récupérer une séance par son ID
export const getSeanceById = async (id) => {
  try {
    const response = await axios.get(`https://www.cefii-developpements.fr/adrien1467/AppSportMobile/API/Public/index.php?controller=SeanceSportive&action=getSeanceById&id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la séance:", error);
    throw error;
  }
};

// Fonction pour récupérer les séances d'un utilisateur spécifique
export const getSeancesByUtilisateur = async (utilisateur_id) => {
  try {
    const response = await axios.get(
      `https://www.cefii-developpements.fr/adrien1467/AppSportMobile/API/Public/index.php?controller=SeanceSportive&action=getSeanceByUtilisateur&utilisateur_id=${utilisateur_id}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des séances de l'utilisateur:",
      error
    );
    throw error;
  }
};

// Fonction pour ajouter une nouvelle séance
export const addSeance = async (seance) => {
  try {
    const response = await axios.post(
      `${baseURL}addSeance`,
      seance
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la séance:", error);
    throw error;
  }
};

export const deleteSeance = async (id) => {
  try {
    const response = await axios.delete(
      `${baseURL}deleteSeance&id=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de la séance:", error);
    throw error;
  }
};

export const updateSeanceEstTerminee = async (id, estTerminee) => {
  try {
    console.log("Envoi de la requête PUT avec : ", { id, estTerminee }); // Vérification des données envoyées
    const response = await axios.put(
      `https://www.cefii-developpements.fr/adrien1467/AppSportMobile/API/Public/index.php?controller=SeanceSportive&action=updateSeanceEstTerminnee`,
      {
        id, 
        estTerminee, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de la séance:", error);
    throw error;
  }
};
