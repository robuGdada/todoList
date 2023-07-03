import { API } from "@/api/API";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoKeys } from "./useTodos";
import { useRouter } from "next/router";

interface NewTodo {
  title: string;
  description: string;
}
export const createTodo = async (newTodo: NewTodo) => {
  const response = await API.post("/todos", newTodo);
  return response.data;
};

const useTodoAdd = () => {
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
export { useTodoAdd };
