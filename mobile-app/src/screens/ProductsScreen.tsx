import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import {
  useNavigation,
  useFocusEffect,
  CompositeNavigationProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, TabParamList } from "../navigation/AppNavigator";
import ProductListItem from "../components/ProductListItem";
import CategoryManagerModal from "../components/CategoryManagerModal";
import api from "../services/api";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  measurement_unit: string;
  image_url: string;
  category: { id: number; name: string } | null;
}

type ProductsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Products">,
  NativeStackNavigationProp<RootStackParamList>
>;

const ProductsScreen = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const navigation = useNavigation<ProductsScreenNavigationProp>();

  const fetchProducts = async () => {
    try {
      if (allProducts.length === 0) setIsLoading(true);
      const response = await api.get("/products");
      setAllProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      Alert.alert("Erro", "Não foi possível carregar os seus produtos.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const filteredProducts = useMemo(() => {
    let productsToDisplay = allProducts;

    if (activeCategoryFilter) {
      productsToDisplay = productsToDisplay.filter(
        (p) => p.category?.id === activeCategoryFilter
      );
    }

    if (searchText.trim()) {
      productsToDisplay = productsToDisplay.filter((p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return productsToDisplay;
  }, [allProducts, activeCategoryFilter, searchText]);

  const handleAddProduct = () => {
    navigation.getParent()?.navigate("ProductForm");
  };
  const handleEditProduct = (productId: string) => {
    navigation.getParent()?.navigate("ProductForm", { productId });
  };
  const handleDeleteProduct = (productId: string, productName: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem a certeza de que deseja apagar o produto "${productName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          onPress: async () => {
            try {
              await api.delete(`/products/${productId}`);
              Alert.alert("Sucesso", "Produto apagado com sucesso!");
              setAllProducts((prevProducts) =>
                prevProducts.filter((p) => String(p.id) !== productId)
              );
            } catch (error) {
              Alert.alert("Erro", "Não foi possível apagar o produto.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading && allProducts.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#00BF63" />
        <Text>A carregar os seus produtos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Meus Produtos</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Feather
              name="search"
              size={20}
              color="gray"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produto..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsCategoryModalVisible(true)}
          >
            <Feather name="filter" size={24} color="#00BF63" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductListItem
              product={item}
              onEdit={() => handleEditProduct(item.id)}
              onDelete={() => handleDeleteProduct(item.id, item.name)}
            />
          )}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
          }
        />
        <TouchableOpacity style={styles.fab} onPress={handleAddProduct}>
          <Feather name="plus" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <CategoryManagerModal
        visible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onApplyFilter={(categoryId) => {
          setActiveCategoryFilter(categoryId);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F5F5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, paddingHorizontal: 20 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: "#000",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 16 },
  filterButton: { marginLeft: 15, padding: 10 },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00BF63",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
});

export default ProductsScreen;
