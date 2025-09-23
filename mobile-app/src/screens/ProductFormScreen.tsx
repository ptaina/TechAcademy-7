import React, { useState, useEffect } from "react";
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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";
import api from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "ProductForm">;

interface Category {
  id: number;
  name: string;
}

const ProductFormScreen = ({ route, navigation }: Props) => {
  const { productId } = route.params || {};
  const isEditing = !!productId;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [measurementUnit, setMeasurementUnit] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await api.get("/categories");
        setCategories(categoriesResponse.data);

        if (isEditing) {
          const productResponse = await api.get(`/products/${productId}`);
          const product = productResponse.data;
          setName(product.name);
          setDescription(product.description || "");
          setPrice(String(product.price));
          setStockQuantity(String(product.stock_quantity));
          setMeasurementUnit(product.measurement_unit);
          setCategoryId(product.categoryId);
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados necessários.");
        navigation.goBack();
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [isEditing, productId]);

  const handleSave = async () => {
    if (!name || !price || !stockQuantity || !measurementUnit || !categoryId) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos obrigatórios, incluindo a categoria."
      );
      return;
    }

    setIsLoading(true);

    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock_quantity: parseInt(stockQuantity, 10),
      measurement_unit: measurementUnit,
      categoryId: categoryId,
      image_url: imageUri || "https://via.placeholder.com/150",
    };

    try {
      if (isEditing) {
        await api.put(`/products/${productId}`, productData);
        Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      } else {
        await api.post("/products", productData);
        Alert.alert("Sucesso", "Produto adicionado com sucesso!");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      let errorMessage = "Ocorreu um erro ao salvar o produto.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#00BF63" />
        <Text>Carregando dados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditing ? "Editar Produto" : "Adicionar Produto"}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <TouchableOpacity style={styles.imagePicker}>
            <Feather name="camera" size={32} color="#00BF63" />
            <Text style={styles.imagePickerText}>
              Clique para adicionar uma foto
            </Text>
          </TouchableOpacity>

          <CustomInput
            label="Nome do Produto:"
            value={name}
            onChangeText={setName}
            placeholder="Ex: Tomate Italiano"
          />
          <CustomInput
            label="Descrição:"
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Doce e suculento"
            multiline
          />

          <Text style={styles.label}>Categoria:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoryId}
              onValueChange={(itemValue) => setCategoryId(itemValue)}
              style={styles.picker}
              prompt="Selecione uma categoria"
            >
              <Picker.Item
                label="Selecione uma categoria..."
                value={null}
                enabled={false}
                style={{ color: "gray" }}
              />
              {categories.map((cat) => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
              ))}
            </Picker>
          </View>

          <CustomInput
            label="Preço (R$):"
            value={price}
            onChangeText={setPrice}
            placeholder="Ex: 25.50"
            keyboardType="numeric"
          />
          <CustomInput
            label="Quantidade em estoque:"
            value={stockQuantity}
            onChangeText={setStockQuantity}
            placeholder="Ex: 50"
            keyboardType="numeric"
          />
          <CustomInput
            label="Unidade de Medida:"
            value={measurementUnit}
            onChangeText={setMeasurementUnit}
            placeholder="Ex: kg, cx, dz, sc"
          />

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={isEditing ? "Salvar Alterações" : "Adicionar Produto"}
              onPress={handleSave}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F5F5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  imagePicker: {
    height: 150,
    borderWidth: 2,
    borderColor: "#00BF63",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    marginBottom: 30,
    overflow: "hidden",
  },
  imagePickerText: { color: "#00BF63", marginTop: 10 },
  productImage: {
    width: "100%",
    height: "100%",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 15,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default ProductFormScreen;
