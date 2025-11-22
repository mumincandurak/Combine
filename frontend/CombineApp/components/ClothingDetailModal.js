import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../screens/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ClothingDetailModal = ({ visible, item, onClose }) => {
  if (!item) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <LinearGradient
          colors={['#4c2a85', '#2a1a45']}
          style={styles.modalView}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color={COLORS.white} />
          </TouchableOpacity>

          <ScrollView>
            <Image source={{ uri: item.imageUrl }} style={styles.modalImage} />
            <Text style={styles.modalText}><Text style={styles.label}>Name:</Text> {item.name}</Text>
            <Text style={styles.modalText}><Text style={styles.label}>Category:</Text> {item.category}</Text>
            <Text style={styles.modalText}><Text style={styles.label}>Color:</Text> {item.color}</Text>
            <Text style={styles.modalText}><Text style={styles.label}>Season:</Text> {item.season}</Text>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 25,
    paddingTop: 40, 
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  label: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    color: COLORS.white,
  },
});

export default ClothingDetailModal;
