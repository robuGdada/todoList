import { API } from "@/api/API";
import { TTodo } from "@/types/TTodo";
import { QueryFunction, useQuery } from "@tanstack/react-query";

// const getKeys = {
//   all: ["getTodo"] as const,
// };

// type TGetQueryKey = typeof getKeys.all;
// \: QueryFunction<TTodo[], TGetQueryKey>
const fetchTodoData = async () => {
  const response = await API.get("todos");
  return response.data;
};
const useGet = () => {
  return useQuery({
    queryKey: ["getKeys"],
    queryFn: fetchTodoData,
  });
};
export { useGet };
