export interface TTodo {
  completed: number;
  id?: number;
  title: string;
  description: string;
  category: { id: number; name: string };
  imageUrl?: string;
}
