import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ProductListItemProps {
  product: {
    image_url: string;
    name: string;
    price: number;
    stock_quantity: number;
    measurement_unit: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image_url }} style={styles.productImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDetails}>
          R$ {Number(product.price).toFixed(2)} / {product.measurement_unit}
        </Text>
        <Text style={styles.productDetails}>
          Estoque: {product.stock_quantity} {product.measurement_unit}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
          <Feather name="edit-2" size={22} color="#FFA500" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
          <Feather name="trash-2" size={22} color="#E53935" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 14,
    color: "gray",
  },
  actionsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  iconButton: {
    padding: 5,
  },
});

export default ProductListItem;
