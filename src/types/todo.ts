import { STATUS } from "./enums";

export interface Todo {
    id: string;
    title: string;
    description: string;
    status: STATUS;
    created_at: string;
    updated_at: string;
}