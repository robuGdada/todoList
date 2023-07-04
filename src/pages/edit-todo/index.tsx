import { useTodoUpdate } from "@/hooks/useTodoUpdate";
import { useRouter } from "next/router";
import React, { useState } from "react";

const EditTodo = () => {
  const { query } = useRouter();
  const [title, setTitle] = useState(query.title);
  const [description, setDescription] = useState(query.description);
  const mutation = useTodoUpdate();

  return (
    <>
      <div className="container">
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="text-area"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="btn-submit"
          onClick={() =>
            mutation.mutate({
              title: String(title),
              description: String(description),
              id: String(query.id),
            })
          }
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default EditTodo;
