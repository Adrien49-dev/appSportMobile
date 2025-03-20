Le projet AppSportMobile est une application mobile développée avec React Native, qui permet aux utilisateurs de gérer et suivre leurs activités sportives. 
L’application repose sur une API RESTful pour la gestion des utilisateurs, des activités sportives et des séances d’entraînement.
L’objectif principal est de fournir aux utilisateurs un moyen simple et efficace pour planifier, enregistrer et suivre leurs séances sportives, tout en offrant une authentification sécurisée et une gestion personnalisée des activités.

2. Fonctionnalités principales

Authentification & Gestion des Utilisateurs
Connexion sécurisée avec email et mot de passe. 
Création d’un compte utilisateur via un formulaire d’inscription. 
Stockage du token et de l'utilisateur_id après connexion. 
Navigation entre les écrans selon l’état d’authentification. 
Gestion des Activités Sportives
Récupération de toutes les activités sportives disponibles depuis l’API. 
Affichage du détail d’une activité spécifique. 
Ajout d’une nouvelle activité. 
Gestion des Séances Sportives
Récupération de toutes les séances enregistrées. 
Consultation d’une séance spécifique via son ID. 
Ajout d’une nouvelle séance à un utilisateur. 
Suppression d’une séance existante. 

Mise à jour de l’état d’une séance (estTerminée). 
Filtrage des séances par utilisateur. 

![Screenshot_2025-03-20-15-32-32-551_host exp exponent](https://github.com/user-attachments/assets/54d22d03-38f4-4130-bc7f-f444f563f49a)

3. Architecture technique
Frontend : React Native avec react-navigation pour la navigation. 
Backend API : PHP (REST API exposée via une URL publique). 
Gestion de l'état : Context API (AuthContext) pour stocker les informations de l’utilisateur connecté. 
Requêtes HTTP : axios pour communiquer avec l’API. 
UI/UX : Utilisation de StyleSheet pour styliser les écrans. 
