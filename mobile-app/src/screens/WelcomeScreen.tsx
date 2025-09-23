import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const logoImage = require("../assets/images/logo-carrinho-branca.png");

const WelcomeScreen = ({ navigation }: Props) => {
  const handleStartPress = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Image source={logoImage} style={styles.logo} />
      <Text style={styles.title}>AgroConecta</Text>
      <TouchableOpacity style={styles.button} onPress={handleStartPress}>
        <Text style={styles.buttonText}>Começar</Text>
        <Feather name="arrow-right" size={24} color="#00BF63" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00BF63",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: "contain",
    marginBottom: -100,
  },
  title: {
    fontFamily: "Agbalumo",
    fontSize: 54,
    color: "#FFFFFF",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    position: "absolute",
    bottom: 50,
  },
  buttonText: {
    fontSize: 18,
    color: "#00BF63",
    fontWeight: "bold",
    marginRight: 10,
  },
});

export default WelcomeScreen;
