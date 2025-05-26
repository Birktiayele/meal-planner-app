// AddGroceryModal.tsx
// Full-screen modal for adding or editing grocery items.
// Includes input fields for name, quantity, and category,
// with support for both manual entry and editing existing items.

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

interface AddGroceryModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (
    category: string,
    item: {
      id: string;
      name: string;
      quantity: string;
      checked: boolean;
    }
  ) => void;
  editingItem?: {
    category: string;
    item: {
      id: string;
      name: string;
      quantity: string;
      checked: boolean;
    };
  };
}

export default function AddGroceryModal({
  visible,
  onClose,
  onAdd,
  editingItem,
}: AddGroceryModalProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('Produce');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.item.name);
      setQuantity(editingItem.item.quantity || '');
      setCategory(editingItem.category);
    } else {
      setName('');
      setQuantity('');
      setCategory('Produce');
    }
  }, [editingItem, visible]);

  const handleAdd = () => {
    if (!name.trim()) return;

    const newItem = {
      id: editingItem?.item.id || Date.now().toString(),
      name: name.trim(),
      quantity: quantity.trim(),
      checked: editingItem?.item.checked ?? false,
    };

    onAdd(category, newItem);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.fullScreenContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.header}>
              {editingItem ? 'Edit Grocery Item' : 'Add Grocery Item'}
            </Text>

            <TextInput
              placeholder="Item name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Quantity (optional)"
              value={quantity}
              onChangeText={setQuantity}
              style={styles.input}
            />
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#4CAF50"
                >
                    <Picker.Item label="Produce" value="Produce" />
                    <Picker.Item label="Pantry" value="Pantry" />
                    <Picker.Item label="Dairy" value="Dairy" />
                    <Picker.Item label="Meat & Seafood" value="Meat & Seafood" />
                    <Picker.Item label="Frozen" value="Frozen" />
                    <Picker.Item label="Bakery" value="Bakery" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
                </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                <Text style={{ color: '#555' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
                <Text style={{ color: 'white' }}>
                  {editingItem ? 'Save' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#E9FCD7',
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  pickerContainer: {
  backgroundColor: 'white',
  borderRadius: 12,
  marginBottom: 14,
  overflow: 'hidden',
},

picker: {
  height: 50,
  fontSize: 16,
},
});
