// PasteModal.tsx
// Modal that allows users to paste text (e.g., from a recipe or grocery list).
// Captures raw input and passes it back to the parent for parsing or storage.

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function PasteModal({ visible, onClose, onSubmit }) {
  const [text, setText] = useState('');

  const handleContinue = () => {
    if (text.trim()) {
      onSubmit(text);
      setText('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Paste Recipe Notes</Text>
          <TouchableOpacity onPress={handleContinue}>
            <Text style={styles.continue}>Continue</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Paste your recipe text here..."
          multiline
          textAlignVertical="top"
          value={text}
          onChangeText={setText}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9FCD7',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  continue: {
    fontSize: 16,
    color: '#00C851',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    height: height * 0.65,
    padding: 16,
    fontSize: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
