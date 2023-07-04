import { API } from "@/api/API";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoKeys } from "./useTodos";
import { useRouter } from "next/router";

interface IUpdateTodo {
  title: string;
  description: string;
  id: string;
}
export const createTodo = async (newTodo: IUpdateTodo) => {
  const response = await API.put("/todos", newTodo);
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
