// IngredientsModal.tsx
// Modal for entering or editing a list of ingredients for a recipe.
// Supports multi-line input or parsed lists from scraped or pasted text.

import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IngredientsModalProps {
  visible: boolean;
  ingredients: string[];
  onClose: () => void;
  onSave: (ingredients: string[]) => void;
}

export default function IngredientsModal({
  visible,
  ingredients,
  onClose,
  onSave,
}: IngredientsModalProps) {
  const [currentIngredients, setCurrentIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible) {
      setCurrentIngredients(ingredients || []);
    }
  }, [visible, ingredients]);

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      const updated = [...currentIngredients, newIngredient.trim()];
      setCurrentIngredients(updated);
      setNewIngredient('');

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Ingredients</Text>
              <TouchableOpacity onPress={() => onSave(currentIngredients)}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>

            {/* Ingredients List */}
            {currentIngredients.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>• {item}</Text>
              </View>
            ))}

            {/* Input Row */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Add new ingredient"
                value={newIngredient}
                onChangeText={setNewIngredient}
                onSubmitEditing={handleAddIngredient}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
                <Text style={styles.addButtonText}>＋</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E9FCD7',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#333' },
  cancelText: { fontSize: 16, color: '#888' },
  saveText: { fontSize: 16, fontWeight: '700', color: '#00C851' },
  listItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#00C851',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 20, fontWeight: '700' },
});
