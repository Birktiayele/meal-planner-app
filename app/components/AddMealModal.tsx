// AddMealModal.tsx
// Modal that lets users choose how to add a new meal: write manually, browse, paste, or take a photo.
// Displays a styled action menu and triggers the appropriate flow based on user selection.

import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const buttonSize = width / 3.5;

interface AddMealModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectWrite: () => void;
  onSelectSnap: () => void;
  onSelectSearch: () => void;
    onSelectPaste: () => void;  
    onSelectKitchen: () => void; 

}

export default function AddMealModal({
  visible,
  onClose,
  onSelectWrite,
  onSelectSnap,
  onSelectSearch,
  onSelectPaste,
  onSelectKitchen, 
}: AddMealModalProps) {
  return (
    <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <SafeAreaView style={styles.modalStyledBox} edges={['bottom']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Meal</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalGrid}>
              <TouchableOpacity
                style={styles.circleButton}
                onPress={() => {
                  onClose();       
                  onSelectSnap();  
                }}
              >
                <View style={styles.circleIcon}>
                  <Ionicons name="camera-outline" size={24} color="#00C851" />
                </View>
                <Text style={styles.modalBtnText}>Snap a Meal</Text>
              </TouchableOpacity>


            <TouchableOpacity style={styles.circleButton} onPress={onSelectSearch}>
              <View style={styles.circleIcon}>
                <Ionicons name="globe-outline" size={24} color="#00C851" />
              </View>
              <Text style={styles.modalBtnText}>Search Recipes</Text>
            </TouchableOpacity>

           <TouchableOpacity
  style={styles.circleButton}
  onPress={() => {
    onClose();         
    onSelectPaste();   
  }}
>
  <View style={styles.circleIcon}>
    <Ionicons name="clipboard-outline" size={24} color="#00C851" />
  </View>
  <Text style={styles.modalBtnText}>Paste Notes</Text>
</TouchableOpacity>

            <TouchableOpacity style={styles.circleButton} onPress={onSelectWrite}>
              <View style={styles.circleIcon}>
                <Ionicons name="create-outline" size={24} color="#00C851" />
              </View>
              <Text style={styles.modalBtnText}>Write Your Own</Text>
            </TouchableOpacity>

            <TouchableOpacity
                    style={styles.circleButton}
                    onPress={() => {
                      onClose();         
                      onSelectKitchen(); 
                    }}
                  >
              <View style={styles.circleIcon}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#00C851" />
              </View>
              <Text style={styles.modalBtnText}>From Our Kitchen</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.circleButton}>
              <View style={styles.circleIcon}>
                <Ionicons name="sparkles-outline" size={24} color="#00C851" />
              </View>
              <Text style={styles.modalBtnText}>Smart Suggestion</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalStyledBox: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  circleButton: {
    width: buttonSize,
    alignItems: 'center',
    marginBottom: 10,
  },
  circleIcon: {
    backgroundColor: '#E6F9EC',
    padding: 14,
    borderRadius: 50,
    marginBottom: 6,
  },
  modalBtnText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
});
