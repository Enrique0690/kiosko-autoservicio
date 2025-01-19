import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AlertModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const AlertModal = ({ visible, message, onClose }: AlertModalProps) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 35,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 30,
  },
});

export default AlertModal;
