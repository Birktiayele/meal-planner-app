// KitchenRecipesModal.tsx
// Displays a horizontally scrolling list of curated recipes from the app’s kitchen.
// Allows users to browse and select a recipe to add to their meal plan.
// Includes thumbnails, titles, and a themed selection button.

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { fetchKitchenRecipes } from '../../firebase/fetchKitchenRecipes';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (recipe: any) => void;
}

export default function KitchenRecipesModal({ visible, onClose, onSelect }: Props) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      fetchKitchenRecipes().then((data) => {
        setRecipes(data);
        setLoading(false);
      });
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>From Our Kitchen</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#00C851" />
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
                {item.image && (
                  <Image source={{ uri: item.image }} style={styles.image} />
                )}
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <TouchableOpacity style={styles.plusButton}>
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const cardWidth = width * 0.6;
const cardHeight = height * 0.3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9FCD7',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  card: {
    width: cardWidth,
    height: cardHeight,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    padding: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '65%',
    borderRadius: 12,
    marginBottom: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  plusButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#00C851',
    borderRadius: 16,
    padding: 4,
  },
});
