import { API } from "@/api/API";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoKeys } from "./useTodos";
import { useRouter } from "next/router";

interface IUpdateTodo {
  id?: string;
  title: string;
  description: string;
  categoryId: number;
  imageUrl?: string;
}
export const createTodo = async (editTodo: IUpdateTodo) => {
  const response = await API.put(`/todos`, editTodo);
  return response.data;
};

const useTodoUpdate = () => {
  const queryClient = useQueryClient();
  const { back } = useRouter();
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTodoKeys.all });
      back();
    },
  });
};
export { useTodoUpdate };
