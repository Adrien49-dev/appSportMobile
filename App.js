import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "../appSportMobile/context/AuthContext";

import HomeScreen from "../appSportMobile/Screens/HomeScreen";
import LoginScreen from "../appSportMobile/Screens/LoginScreen";
import UtilisateursScreen from "../appSportMobile/Screens/UtilisateursScreen";
import ActiviteScreen from "../appSportMobile/Screens/ActiviteScreen";
import SeancesScreen from "../appSportMobile/Screens/SeancesScreen";
import SeanceDetailScreen from "../appSportMobile/Screens/SeanceDetailScreen";
import AddSeanceScreen from "../appSportMobile/Screens/AddSeanceScreen";
import AddUtilisateur from "../appSportMobile/Screens/AddUtilisateur";


const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Utilisateurs" component={UtilisateursScreen} />
          <Stack.Screen name="Seances" component={SeancesScreen} />
          <Stack.Screen name="SeanceDetails" component={SeanceDetailScreen} />
          <Stack.Screen name="Activites" component={ActiviteScreen} />
          <Stack.Screen name="AddSeance" component={AddSeanceScreen} />
          <Stack.Screen name="AddUtilisateur" component={AddUtilisateur} />
         
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
    </AuthProvider>
  );
}
