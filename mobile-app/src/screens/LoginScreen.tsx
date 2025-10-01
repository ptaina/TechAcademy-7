import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../contexts/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import CustomInput from "../components/CustomInput";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const logoImage = require("../assets/images/logo-carrinho-verde.png");

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Email e senha são obrigatórios.");
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert("Erro no Login", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.title}>AgroConecta</Text>
        <CustomInput
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <CustomInput
          placeholder="**************"
          value={password}
          onChangeText={setPassword}
          secureEntry
        />
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Em breve!",
              "Funcionalidade de recuperação de senha será implementada."
            )
          }
        >
          <Text style={styles.linkText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#00BF63"
            style={{ marginVertical: 10 }}
          />
        ) : (
          <PrimaryButton title="Entrar" onPress={handleLogin} />
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileSelection")}
        >
          <Text style={styles.linkText}>
            Não tem uma conta? Cadastre-se aqui
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: -80,
  },
  title: {
    fontFamily: "Agbalumo",
    fontSize: 42,
    color: "#00BF63",
    marginBottom: 30,
  },
  linkText: {
    color: "#808080",
    fontSize: 14,
    marginVertical: 15,
  },
});

export default LoginScreen;
