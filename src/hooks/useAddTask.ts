import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import todoService from '../services/task';
import { Task } from '../types/task';

interface AddTaskFormData {
    title: string;
    description?: string;
    category: string;
    priority: string;
    dueDate: Date;
}

const schema: yup.ObjectSchema<AddTaskFormData> = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().optional(),
    category: yup.string().required('Category is required'),
    priority: yup.string().required('Priority is required'),
    dueDate: yup.date().required('Due date is required'),
}) as yup.ObjectSchema<AddTaskFormData>;

interface UseAddTaskProps {
    onHandleCloseAddTaskModal: () => void;
}

export const useAddTask = ({ onHandleCloseAddTaskModal }: UseAddTaskProps) => {
    const formState = useForm<AddTaskFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            category: '',
            priority: '',
            dueDate: new Date(),
        },
    });

    const { handleSubmit } = formState;

    const { mutate: addTask, isPending } = useMutation({
        mutationFn: async (payload: AddTaskFormData) => {
            console.log('AddTask payload:', payload);
            const task: Task = {
                title: payload.title,
                description: payload.description || '',
                categoryId: payload.category,
                priority: payload.priority,
                dueDate: payload.dueDate,
            };
            return todoService.createTask(task);
        },
        onSuccess: () => {
            formState.reset();
            onHandleCloseAddTaskModal();
        }
    });

    const onSubmit = (data: AddTaskFormData) => {
        addTask(data);
    };

    return {
        formState,
        onSubmit: handleSubmit(onSubmit),
        isSubmitting: isPending,
    };
};