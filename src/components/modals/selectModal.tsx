import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectModalProps {
  title: string;
  options: { label: string, value: string }[];
  selectedOption: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}

const SelectModal = ({ title, options, selectedOption, onSelect, onClose }: SelectModalProps) => {
  return (
    <Pressable
      style={styles.pickerOverlay}
      onPress={onClose}
    >
      <Pressable style={styles.pickerContainer} onPress={(e) => e.stopPropagation()}>
        <View style={styles.pickerHeader}>
          <Text style={styles.pickerTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.pickerOption,
              selectedOption === option.value && styles.pickerOptionSelected
            ]}
            onPress={() => onSelect(String(option.value))}
          >
            <Text style={[
              styles.pickerOptionText,
              selectedOption === option.value && styles.pickerOptionTextSelected
            ]}>
              {option.label}
            </Text>
            {selectedOption === option.value && (
              <Ionicons name="checkmark" size={20} color="black" />
            )}
          </TouchableOpacity>
        ))}
      </Pressable>
    </Pressable>
  )
}

export const styles = StyleSheet.create({
  pickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  pickerOptionSelected: {
    backgroundColor: '#E8F5E9',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptionTextSelected: {
    fontWeight: '600',
  },
});

export default SelectModal