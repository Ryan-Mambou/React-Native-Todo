import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DeleteTaskModalProps {
    onCancel: () => void;
    onDelete: () => void;
    isDeleting?: boolean;
}

export const DeleteTaskModal = ({ onCancel, onDelete, isDeleting = false }: DeleteTaskModalProps) => {
    return (
        <Pressable style={styles.overlay} onPress={onCancel}>
            <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.iconContainer}>
                    <Ionicons name="trash-outline" size={48} color="#EF4444" />
                </View>
                <Text style={styles.title}>Delete Task</Text>
                <Text style={styles.message}>
                    Are you sure you want to delete this task? This action cannot be undone.
                </Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete} style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]} disabled={isDeleting}>
                        <Text style={styles.deleteButtonText}>{isDeleting ? 'Deleting...' : 'Delete'}</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#EF4444',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButtonDisabled: {
        opacity: 0.6,
    },
});