// InstructionsModal.tsx
// Modal for writing or editing cooking instructions for a meal.
// Supports long-form multi-step input and integration with scraped recipe data.

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
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface InstructionsModalProps {
  visible: boolean;
  instructions: string[];
  onClose: () => void;
  onSave: (instructions: string[]) => void;
}

export default function InstructionsModal({ visible, instructions, onClose, onSave }: InstructionsModalProps) {
  const [currentInstructions, setCurrentInstructions] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible) {
      console.log('📥 InstructionsModal received:', instructions);
      setCurrentInstructions(instructions || []);
    }
  }, [visible, instructions]);

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      const updated = [...currentInstructions, newInstruction.trim()];
      setCurrentInstructions(updated);
      setNewInstruction('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
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
              <Text style={styles.title}>Instructions</Text>
              <TouchableOpacity onPress={() => onSave(currentInstructions)}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>

            {/* Steps List */}
            {currentInstructions.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>{index + 1}. {item}</Text>
              </View>
            ))}

            {/* Input Row */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Add new step"
                value={newInstruction}
                onChangeText={setNewInstruction}
                onSubmitEditing={handleAddInstruction}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddInstruction}>
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
    paddingHorizontal: 10,
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
    marginTop: 16,
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
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});
