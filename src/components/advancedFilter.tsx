import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AdvancedFilterProps {
    onHandleShowFilterModal: () => void;
    hasActiveFilters: boolean;
}

const AdvancedFilter = ({ onHandleShowFilterModal, hasActiveFilters }: AdvancedFilterProps) => {
  return (
    <TouchableOpacity 
            style={styles.advancedFilter}
            onPress={onHandleShowFilterModal}
          >
            <Ionicons name="filter-outline" size={20} color="black" />
            <Text>Filters</Text>
            {hasActiveFilters && <View style={styles.filterIndicator} />}
          </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    advancedFilter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
      },
      filterIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'black',
      },
});

export default AdvancedFilter;