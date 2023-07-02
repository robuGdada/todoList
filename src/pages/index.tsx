import { TodoList } from "@/components/TodoList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const index = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    </div>
  );
};

export default index;
