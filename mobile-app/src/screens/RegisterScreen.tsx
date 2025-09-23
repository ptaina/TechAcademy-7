import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import axios, { AxiosError } from "axios";

import api from "../services/api";
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../contexts/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen = ({ navigation }: Props) => {
  const [producerName, setProducerName] = useState("");
  const [establishmentName, setEstablishmentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignUp = async () => {
    // Validações
    if (
      !producerName ||
      !email ||
      !phone ||
      !cpf ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        "Erro",
        "Por favor, preencha todos os campos obrigatórios (*)."
      );
      return;
    }
    if (!cpfValidator.isValid(cpf)) {
      Alert.alert("Erro", "O CPF informado é inválido.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Erro de Senha",
        "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número."
      );
      return;
    }

    setIsLoading(true);

    try {
      const producerData = {
        name: producerName,
        establishmentName: establishmentName || null,
        email,
        phone,
        cpf,
        address,
        password,
      };

      await api.post("/producers", producerData);
      Alert.alert(
        "Sucesso!",
        "Produtor cadastrado com sucesso! A fazer login..."
      );

      try {
        await signIn(email, password);
      } catch (loginError) {
        console.error("Erro no login automático:", loginError);
        Alert.alert(
          "Erro no Login Automático",
          (loginError as Error).message +
            "\n\nPor favor, tente fazer login manualmente."
        );
        navigation.navigate("Login");
      }
    } catch (signUpError) {
      if (axios.isAxiosError(signUpError)) {
        const axiosError = signUpError as AxiosError<{ error: string }>;
        const errorMessage =
          axiosError.response?.data?.error || "Ocorreu um erro no servidor.";
        Alert.alert("Erro no Cadastro", errorMessage);
      } else {
        Alert.alert("Erro Inesperado", "Ocorreu um erro durante o cadastro.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Crie sua conta</Text>
            <View style={{ width: 28 }} />
          </View>

          <Text style={styles.stepText}>Passo 2 de 2: Preencha seus dados</Text>

          <CustomInput
            label="Nome do Produtor:*"
            placeholder="Digite o nome completo"
            value={producerName}
            onChangeText={setProducerName}
          />
          <CustomInput
            label="Nome do Estabelecimento (opcional):"
            placeholder="Digite o nome do estabelecimento"
            value={establishmentName}
            onChangeText={setEstablishmentName}
          />
          <CustomInput
            label="Email: *"
            placeholder="exemplo@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomInput
            label="Telefone / WhatsApp: *"
            placeholder="(XX) XXXXX-XXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <CustomInput
            label="CPF: *"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />
          <CustomInput
            label="Endereço: *"
            placeholder="Rua, número, bairro, cidade..."
            value={address}
            onChangeText={setAddress}
          />
          <CustomInput
            label="Crie uma senha: *"
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureEntry
          />
          <CustomInput
            label="Confirme sua senha: *"
            placeholder="********"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureEntry
          />

          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#00BF63" />
            ) : (
              <PrimaryButton title="Criar conta" onPress={handleSignUp} />
            )}
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Já tem uma conta? Faça login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  stepText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "left",
  },
  buttonContainer: {
    marginTop: 20,
  },
  loginText: {
    textAlign: "center",
    color: "#00BF63",
    fontWeight: "bold",
    marginTop: 15,
  },
});

export default RegisterScreen;
