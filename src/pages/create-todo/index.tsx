import { useTodoAdd } from "@/hooks/useTodoAdd";
import React, { useState } from "react";

const CreateTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const mutation = useTodoAdd();

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
          onClick={() => mutation.mutate({ title, description })}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default CreateTodo;
