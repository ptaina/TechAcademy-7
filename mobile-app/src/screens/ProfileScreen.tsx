import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";

interface ProducerDetails {
  name: string;
  establishmentName: string | null;
  email: string;
  phone: string;
  address: string;
}

interface InfoRowProps {
  icon: React.ComponentProps<typeof Feather>["name"];
  text: string | null | undefined; // <- Corrija aqui
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, text }) => (
  <View style={styles.infoRow}>
    <Feather name={icon} size={24} color="#00BF63" />
    <Text style={styles.infoText}>{text || "Não informado"}</Text>
  </View>
);

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const [producerDetails, setProducerDetails] =
    useState<ProducerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchProducerData = async () => {
        if (user?.id) {
          try {
            const response = await api.get(`/producers/${user.id}`);
            setProducerDetails(response.data);
          } catch (error) {
            Alert.alert(
              "Erro",
              "Não foi possível carregar os dados do seu perfil."
            );
          } finally {
            setIsLoading(false);
          }
        }
      };

      fetchProducerData();
    }, [user])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color="#00BF63" />
        <Text style={{ marginTop: 10, color: "gray" }}>
          A carregar perfil...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
        </View>

        <View style={styles.profileHeader}>
          {/* Placeholder para a imagem, como combinado */}
          <View style={styles.avatarPlaceholder}>
            <Feather name="user" size={60} color="#00BF63" />
          </View>
          <Text style={styles.establishmentName}>
            {producerDetails?.establishmentName || producerDetails?.name}
          </Text>
          <Text style={styles.producerName}>Sr. {producerDetails?.name}</Text>
        </View>

        <View style={styles.infoSection}>
          <InfoRow icon="user" text={producerDetails?.name} />
          <InfoRow icon="briefcase" text={producerDetails?.establishmentName} />
          <InfoRow icon="phone" text={producerDetails?.phone} />
          <InfoRow icon="map-pin" text={producerDetails?.address} />
        </View>

        <View style={styles.actionsSection}>
          <PrimaryButton
            title="Editar Perfil"
            onPress={() =>
              Alert.alert(
                "Em breve!",
                "Funcionalidade de edição de perfil será implementada."
              )
            }
          />
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Em breve!",
                "Funcionalidade de alterar senha será implementada."
              )
            }
          >
            <Text style={styles.linkText}>Alterar senha</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  centered: { justifyContent: "center", alignItems: "center" },
  container: { paddingBottom: 40, alignItems: "center" },
  header: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  profileHeader: { alignItems: "center", marginBottom: 30 },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00BF63",
  },
  establishmentName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00BF63",
    textAlign: "center",
  },
  producerName: { fontSize: 18, color: "gray", marginTop: 5 },
  infoSection: { width: "90%", marginBottom: 30 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoText: { fontSize: 16, marginLeft: 15, color: "#333", flex: 1 },
  actionsSection: { width: "90%", marginBottom: 40 },
  linkText: {
    color: "#00BF63",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
  },
  footerSection: { width: "90%" },
  logoutButton: {
    backgroundColor: "#FFEBEE",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#E53935",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
