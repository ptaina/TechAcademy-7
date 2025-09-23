import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import api from "../services/api";

interface CategoryManagerModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (categoryId: number | null) => void;
}

interface Category {
  id: number;
  name: string;
}

const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  visible,
  onClose,
  onApplyFilter,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      if (!isLoading) setIsLoading(true);
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await api.post("/categories", { name: newCategoryName });
      setCategories((prev) => [...prev, response.data]);
      setNewCategoryName("");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar a categoria.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = (categoryId: number, categoryName: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem a certeza de que deseja apagar a categoria "${categoryName}"? Todos os produtos associados serão apagados.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          onPress: async () => {
            try {
              await api.delete(`/categories/${categoryId}`);
              setCategories((prev) =>
                prev.filter((cat) => cat.id !== categoryId)
              );
            } catch (error) {
              Alert.alert("Erro", "Não foi possível apagar a categoria.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleApply = () => {
    onApplyFilter(selectedCategoryId);
    onClose();
  };

  const handleClear = () => {
    setSelectedCategoryId(null);
    onApplyFilter(null);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Filtrar & Gerir Categorias</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome da nova categoria"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddCategory}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Feather name="plus" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#00BF63"
              style={{ marginTop: 20 }}
            />
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategoryId === item.id && styles.selectedCategory,
                  ]}
                  onPress={() => setSelectedCategoryId(item.id)}
                >
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(item.id, item.name)}
                  >
                    <Feather name="trash-2" size={20} color="#E53935" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Nenhuma categoria registada.
                </Text>
              }
            />
          )}

          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleClear}
            >
              <Text style={styles.secondaryButtonText}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleApply}
            >
              <Text style={styles.primaryButtonText}>Aplicar Filtro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  inputContainer: { flexDirection: "row", marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#00BF63",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    borderRadius: 8,
    marginBottom: 5,
  },
  selectedCategory: {
    backgroundColor: "#E8F5E9",
    borderColor: "#00BF63",
    borderWidth: 1.5,
  },
  categoryName: { fontSize: 16 },
  emptyText: { textAlign: "center", marginTop: 20, color: "gray" },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#00BF63",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  primaryButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  secondaryButton: {
    backgroundColor: "#EEE",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  secondaryButtonText: { color: "#333", fontWeight: "bold", fontSize: 16 },
});

export default CategoryManagerModal;
