import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import taskService from '../../../../services/task';

export const useDeleteTaskModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { mutate: deleteTask, isPending: isDeleting } = useMutation({
        mutationFn: (taskId: string) => taskService.deleteTask(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setIsOpen(false);
            setTaskIdToDelete(null);
        },
    });

    const openModal = useCallback((taskId: string) => {
        setTaskIdToDelete(taskId);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setTaskIdToDelete(null);
    }, []);

    const handleDelete = useCallback(() => {
        if (taskIdToDelete) {
            deleteTask(taskIdToDelete);
        }
    }, [taskIdToDelete, deleteTask]);

    return {
        isOpen,
        openModal,
        closeModal,
        handleDelete,
        handleCancel: closeModal,
        isDeleting,
    };
};
