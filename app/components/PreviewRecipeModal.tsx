// PreviewRecipeModal.tsx
// Modal for previewing a full recipe before saving or adding it to a meal plan.
// Displays recipe title, image, ingredients, instructions, and metadata in a styled layout.
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  recipe: any;  
  onAdd: (notes: string) => void;
}

export default function PreviewRecipeModal({ visible, onClose, recipe, onAdd }: Props) {
  const [notes, setNotes] = useState('');

  if (!recipe) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.headerRow}>
            <Text style={styles.header}>Preview</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {recipe.image && (
            <Image source={{ uri: recipe.image }} style={styles.image} />
          )}

          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.meta}>{recipe.course} • {recipe.cuisine}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients?.map((item: string, i: number) => (
              <Text key={i} style={styles.bullet}>• {item}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.instructions?.map((step: string, i: number) => (
              <Text key={i} style={styles.step}>{i + 1}. {step}</Text>
            ))}
          </View>

          <View style={styles.rowWrap}>
            <Text style={styles.badge}>Prep: {formatTime(recipe.prepTime)}</Text>
            <Text style={styles.badge}>Cook: {formatTime(recipe.cookTime)}</Text>
            {recipe.nutrition?.calories && (
              <Text style={styles.badge}>{recipe.nutrition.calories} kcal</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add your personal notes here..."
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              onAdd(notes);
              setNotes('');
            }}
          >
            <Text style={styles.addBtnText}>Add to Meal Plan</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const formatTime = (iso: string) => {
  if (!iso) return '—';
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = match?.[1] ? `${match[1]}h ` : '';
  const mins = match?.[2] ? `${match[2]}m` : '';
  return hours + mins || '—';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9FCD7',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  image: {
    width: '100%',
    height: width * 0.5,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  bullet: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    marginBottom: 4,
  },
  step: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    color: '#555',
    marginRight: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 60,
  },
  addBtn: {
    backgroundColor: '#00C851',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
