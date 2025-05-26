// CuisineModal.tsx
// Modal for selecting the cuisine type (e.g., Italian, Ethiopian, Korean).
// Helps organize meals and enables filtering or tagging by cultural category.

import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const defaultCuisines = [
  'Italian', 'Mexican', 'American', 'Chinese', 'Indian',
  'Mediterranean', 'Thai', 'Japanese', 'French', 'Greek'
];

interface CuisineModalProps {
  visible: boolean;
  selectedCuisine: string;
  onClose: () => void;
  onSave: (cuisine: string) => void;
}

export default function CuisineModal({
  visible,
  selectedCuisine,
  onClose,
  onSave,
}: CuisineModalProps) {
  const [cuisines, setCuisines] = useState(defaultCuisines);
  const [newCuisine, setNewCuisine] = useState('');
  const [current, setCurrent] = useState(selectedCuisine);

  useEffect(() => {
    if (visible) setCurrent(selectedCuisine);
  }, [visible, selectedCuisine]);

  const addNewCuisine = () => {
    const trimmed = newCuisine.trim();
    if (trimmed && !cuisines.includes(trimmed)) {
      const updatedCuisines = [...cuisines, trimmed];
      setCuisines(updatedCuisines);
      setCurrent(trimmed);
      setNewCuisine('');
    }
  };

  const handleBackPress = () => {
    onSave(current);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.title}>Choose Cuisine</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Cuisine Chips */}
            <FlatList
              data={cuisines}
              numColumns={2}
              contentContainerStyle={{ paddingBottom: 100 }}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.chip,
                    current === item && styles.chipSelected,
                  ]}
                  onPress={() => setCurrent(item)}
                >
                  <Text style={current === item ? styles.chipTextSelected : styles.chipText}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* Add New Cuisine */}
            <View style={styles.addRow}>
              <TextInput
                style={styles.input}
                placeholder="Add new cuisine"
                value={newCuisine}
                onChangeText={setNewCuisine}
                onSubmitEditing={addNewCuisine}
              />
              <TouchableOpacity onPress={addNewCuisine} style={styles.addBtn}>
                <Text style={styles.addBtnText}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    flex: 1,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  chip: {
    width: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chipSelected: {
    backgroundColor: '#00C851',
    borderColor: '#00C851',
    elevation: 3,
  },
  chipText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  chipTextSelected: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtn: {
    marginLeft: 10,
    backgroundColor: '#00C851',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
