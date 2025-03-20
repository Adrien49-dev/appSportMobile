import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "userToken";

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Erreur en sauvegardant le token:", error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Erreur en récupérant le token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Erreur en supprimant le token:", error);
  }

};
