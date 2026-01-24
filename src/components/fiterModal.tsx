import React from 'react'
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'


interface FiterModalProps {
  selectedCategory: string
  selectedPriority: string
  selectedSort: string
  hasActiveFilters: boolean
  onHandleCloseFilterModal: () => void
  onHandleClearFilters: () => void
  onHandleSelectCategory: (category: string) => void
  onHandleSelectPriority: (priority: string) => void
  onHandleSelectSort: (sort: string) => void
}

export function FiterModal ({ selectedCategory, selectedPriority, selectedSort, 
    hasActiveFilters, onHandleCloseFilterModal, onHandleClearFilters, onHandleSelectCategory, 
    onHandleSelectPriority, onHandleSelectSort }: FiterModalProps) {

    return (
        <Pressable 
        style={styles.modalOverlay}
        onPress={onHandleCloseFilterModal}
      >
        <Pressable style={styles.filterModal} onPress={(e) => e.stopPropagation()}>
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Category</Text>
            <View style={styles.filterOptions}>
              {['All', 'Personal', 'Work', 'Shopping'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    selectedCategory === category && styles.filterOptionSelected
                  ]}
                  onPress={() => onHandleSelectCategory(category)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedCategory === category && styles.filterOptionTextSelected
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Priority</Text>
            <View style={styles.filterOptions}>
              {['All', 'High', 'Medium', 'Low'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.filterOption,
                    selectedPriority === priority && styles.filterOptionSelectedPriority
                  ]}
                  onPress={() => onHandleSelectPriority(priority)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedPriority === priority && styles.filterOptionTextSelected
                  ]}>
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.filterOptions}>
              {['Newest First', 'Due Date', 'Priority', 'A-Z'].map((sort) => (
                <TouchableOpacity
                  key={sort}
                  style={[
                    styles.filterOption,
                    selectedSort === sort && styles.filterOptionSelectedPriority
                  ]}
                  onPress={() => onHandleSelectSort(sort)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedSort === sort && styles.filterOptionTextSelected
                  ]}>
                    {sort}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {hasActiveFilters && <TouchableOpacity 
            style={styles.clearFiltersButton}
            onPress={onHandleClearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear Filters</Text>
          </TouchableOpacity>}
        </Pressable>
      </Pressable>
    )
  }

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
    filterModal: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      filterSection: {
        marginBottom: 24,
      },
      filterSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
      },
      filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
      },
      filterOption: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: 'transparent',
      },
      filterOptionSelected: {
        backgroundColor: '#4CAF50',
      },
      filterOptionSelectedPriority: {
        backgroundColor: '#1A1A1A',
      },
      filterOptionText: {
        fontSize: 14,
        color: '#333',
      },
      filterOptionTextSelected: {
        color: '#FFFFFF',
        fontWeight: '500',
      },
      clearFiltersButton: {
        marginTop: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: 'white',
        alignItems: 'center',
      },
      clearFiltersText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
      },
})