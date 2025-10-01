import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";
import { AxiosError } from "axios";

interface Producer {
  id: number;
  name: string;
  email: string;
}

interface AuthContextData {
  user: Producer | null;
  token: string | null;
  isLoading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Producer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await SecureStore.getItemAsync("user_token");
        const storedUser = await SecureStore.getItemAsync("user_data");

        if (storedToken && storedUser) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;

          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error(
          "Falha ao carregar dados de autenticação do armazenamento",
          e
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { email, password });
      const { producer, token: responseToken } = response.data;

      setUser(producer);
      setToken(responseToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${responseToken}`;

      await SecureStore.setItemAsync("user_token", responseToken);
      await SecureStore.setItemAsync("user_data", JSON.stringify(producer));
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Email ou senha inválidos.";
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync("user_token");
      await SecureStore.deleteItemAsync("user_data");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      setToken(null);
    } catch (e) {
      console.error("Falha ao fazer logout", e);
    }
  };

  const authContextValue = {
    user,
    token,
    isLoading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
