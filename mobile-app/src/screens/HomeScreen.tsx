import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

interface StatCardProps {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  value: string;
}
const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <View style={styles.statCard}>
    <Feather name={icon} size={28} color="#00BF63" />
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);
interface OrderItemProps {
  store: string;
  items: string;
  price: string;
  date: string;
}
const OrderItem: React.FC<OrderItemProps> = ({ store, items, price, date }) => (
  <View style={styles.orderItem}>
    <View>
      <Text style={styles.orderStore}>{store}</Text>
      <Text style={styles.orderItems}>{items}</Text>
    </View>
    <View style={{ alignItems: "flex-end" }}>
      <Text style={styles.orderPrice}>{price}</Text>
      <Text style={styles.orderDate}>{date}</Text>
    </View>
  </View>
);

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "App"
>;

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.headerTitle}>Início</Text>
        <Text style={styles.welcomeText}>Olá, {user?.name || "Produtor"}</Text>

        <View style={styles.statsContainer}>
          <StatCard icon="shopping-cart" title="Pedidos de hoje" value="25" />
          <StatCard
            icon="dollar-sign"
            title="Faturamento do mês"
            value="R$ 5.567,89"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimos pedidos</Text>
          <OrderItem
            store="Restaurante Sabor Divino"
            items="Alface americana (1 cx)"
            price="R$ 35,50"
            date="26/08"
          />
          <OrderItem
            store="Mercado Central"
            items="Alface crespa (2 cx)"
            price="R$ 80,00"
            date="26/08"
          />
          <OrderItem
            store="Supermercado Paraná"
            items="Manga espada (5 kg)"
            price="R$ 62,50"
            date="26/08"
          />
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todos os pedidos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.getParent()?.navigate("ProductForm")}
          >
            <Feather name="plus-circle" size={24} color="#00BF63" />
            <Text style={styles.actionButtonText}>Adicionar Produto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    width: "48%",
    alignItems: "flex-start",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statTitle: {
    fontSize: 14,
    color: "gray",
    marginTop: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  orderItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  orderStore: {
    fontWeight: "bold",
    fontSize: 16,
  },
  orderItems: {
    color: "gray",
  },
  orderPrice: {
    fontWeight: "bold",
    fontSize: 16,
  },
  orderDate: {
    color: "gray",
  },
  seeAllText: {
    color: "#00BF63",
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  actionButtonText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default HomeScreen;
