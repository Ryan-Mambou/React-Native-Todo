export interface Task {
    id?: string;
    title: string;
    description: string;
    category_id: number;
    priority: string;
    dueDate: Date;
    status?: 'pending' | 'completed';
    created_at?: Date;
    updated_at?: Date;
}