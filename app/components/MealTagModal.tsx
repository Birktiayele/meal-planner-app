// MealTagModal.tsx
// Modal that allows users to select or add custom tags to a meal (e.g., High Protein, Vegan, Quick).
// Helps categorize meals and enables filtering or future recommendations.

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MealTagModalProps {
  visible: boolean;
  selectedTags: string[];
  onClose: () => void;
  onSave: (tags: string[]) => void;
}

const sections = [
  {
    title: 'Meal Type',
    data: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Salad', 'Drink', 'Appetizer', 'Side Dish', 'Soup'],
  },
  {
    title: 'Diet & Health',
    data: ['Vegan', 'Vegetarian', 'Healthy', 'Gluten-free', 'Low-fat', 'Keto', 'Paleo', 'Dairy-free', 'Low-carb'],
  },
  {
    title: 'Lifestyle',
    data: ['Budget-friendly', 'Family recipe', 'Meal Prep', 'Kid-friendly', 'One-Pot', 'Spicy', 'Comfort food', 'Gourmet'],
  },
];

export default function MealTagModal({ visible, selectedTags, onClose, onSave }: MealTagModalProps) {
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setTempSelected(selectedTags);
    }
  }, [visible]);

  const toggleTag = (tag: string) => {
    if (tempSelected.includes(tag)) {
      setTempSelected(tempSelected.filter(t => t !== tag));
    } else {
      setTempSelected([...tempSelected, tag]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => {
                onSave(tempSelected);
                onClose();
              }}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Choose Tags</Text>
            <View style={{ width: 30 }} />
          </View>

          {/* SectionList with grouped chips */}
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item + index}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderSectionHeader={({ section: { title, data } }) => (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <View style={styles.tagWrap}>
                  {data.map((tag) => {
                    const isSelected = tempSelected.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => toggleTag(tag)}
                      >
                        <Text style={isSelected ? styles.chipTextSelected : styles.chipText}>{tag}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
            renderItem={() => null}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const { width } = Dimensions.get('window');
const chipMaxWidth = (width - 60) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9FCD7',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backArrow: {
    fontSize: 28,
    color: '#333',
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#555',
    marginBottom: 10,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    maxWidth: chipMaxWidth,
  },
  chipSelected: {
    backgroundColor: '#00C851',
    borderColor: '#00C851',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextSelected: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
});
