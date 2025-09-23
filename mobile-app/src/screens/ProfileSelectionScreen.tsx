import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import SelectionCard from "../components/SelectionCard";

type Props = NativeStackScreenProps<RootStackParamList, "ProfileSelection">;

const producerIcon = require("../assets/images/icone-produtor-verde.png");

const ProfileSelectionScreen = ({ navigation }: Props) => {
  const handleSelectProducer = () => {
    navigation.navigate("Register");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crie a sua conta</Text>
          <View style={{ width: 28 }} />
        </View>
        <Text style={styles.stepText}>
          Passo 1 de 2: Selecione o seu perfil
        </Text>
        <SelectionCard
          icon={producerIcon}
          title="Sou Produtor"
          description="Quero vender os meus produtos na app."
          onPress={handleSelectProducer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F5F5" },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  stepText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ProfileSelectionScreen;
