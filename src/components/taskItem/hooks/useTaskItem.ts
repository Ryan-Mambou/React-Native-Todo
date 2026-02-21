import { useMutation, useQueryClient } from '@tanstack/react-query';
import taskService from '../../../services/task';
import { Task } from '../../../types/task';

export const useTaskItem = () => {
    const queryClient = useQueryClient();

    const { mutate: deleteTask, isPending: isDeleting } = useMutation({
        mutationFn: (taskId: string) => taskService.deleteTask(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const { mutate: toggleComplete, isPending: isToggling } = useMutation({
        mutationFn: ({ task, newStatus }: { task: Task; newStatus: 'pending' | 'completed' }) => {
            if (!task.id) throw new Error('Task id is required');
            return taskService.updateTask(task.id, {
                ...task,
                status: newStatus,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const handleToggleComplete = (task: Task) => {
        const newStatus: 'pending' | 'completed' = task.status === 'completed' ? 'pending' : 'completed';
        toggleComplete({ task, newStatus });
    };

    const handleDeleteTask = (taskId: string) => {
        deleteTask(taskId);
    };

    return {
        deleteTask: handleDeleteTask,
        toggleComplete: handleToggleComplete,
        isDeleting,
        isToggling,
    };
};
