// CourseModal.tsx
// Modal that allows users to select the course type for a meal (e.g., Breakfast, Lunch, Snack).
// Used in meal creation or editing to categorize recipes by course.

import React, { useEffect, useState } from 'react';
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

const defaultCourses = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Main Dish'];

interface CourseModalProps {
  visible: boolean;
  selectedCourse: string;
  onClose: () => void;
  onSave: (course: string) => void;
}

export default function CourseModal({
  visible,
  selectedCourse,
  onClose,
  onSave,
}: CourseModalProps) {
  const [courses, setCourses] = useState(defaultCourses);
  const [newCourse, setNewCourse] = useState('');
  const [current, setCurrent] = useState<string>('');

  useEffect(() => {
    if (visible) {
      const match =
        typeof selectedCourse === 'string'
          ? courses.find((c) => c.toLowerCase() === selectedCourse.toLowerCase())
          : null;
      setCurrent(match || selectedCourse || '');
    }
  }, [visible, selectedCourse]);

  const handleBackPress = () => {
    onSave(current);
    onClose();
  };

  const addNewCourse = () => {
    const trimmed = newCourse.trim();
    if (trimmed && !courses.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...courses, trimmed];
      setCourses(updated);
      setCurrent(trimmed);
      setNewCourse('');
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
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.title}>Choose Course</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Course Chips */}
            <FlatList
              data={courses}
              numColumns={2}
              keyExtractor={(item) => item}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => {
                const isSelected =
                  typeof current === 'string' &&
                  current.toLowerCase() === item.toLowerCase();

                return (
                  <TouchableOpacity
                    onPress={() => setCurrent(item)}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                  >
                    <Text style={isSelected ? styles.chipTextSelected : styles.chipText}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            {/* Add New Course */}
            <View style={styles.addRow}>
              <TextInput
                style={styles.input}
                placeholder="Add new course"
                value={newCourse}
                onChangeText={setNewCourse}
                onSubmitEditing={addNewCourse}
              />
              <TouchableOpacity onPress={addNewCourse} style={styles.addBtn}>
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
