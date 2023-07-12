import { fileToBlob } from "@/utils/fileToBlob";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { useCategoryQuery } from "../create-todo/useCategoryQuery";
import { useTodoUpdate } from "@/hooks/useTodoUpdate";
import { useUploadUrl } from "@/hooks/useUploadUrl";

type UploadResponse = {
  message: string;
  data: { uploadUrl: string; url: string };
};

const EditTodo = () => {
  const { query } = useRouter();
  const [title, setTitle] = useState(query.title);
  const [description, setDescription] = useState(query.description);
  const [file, setFile] = useState<any>(query.imageUrl || null);
  const [fileType, setFileType] = useState("");
  const [categoryId, setCategoryId] = useState(query.categoryId);

  const { data: categoryData } = useCategoryQuery();
  const { mutateAsync: editTodo } = useTodoUpdate();

  const uploadToS3 = async (val: { uploadUrl: string; blobData: Blob }) => {
    return await axios({
      method: "put",
      url: val.uploadUrl,
      headers: {
        "Content-Type": fileType,
      },
      data: val.blobData,
    });
  };

  const { mutateAsync: s3Mutate } = useMutation(uploadToS3);

  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setFile(e?.target?.result as any);
      };
      reader.readAsDataURL(file);
      setFileType(file.type);
    }
  };

  const { mutate: updateTodoWithImage } = useUploadUrl({
    onSuccess: async (res: UploadResponse) => {
      if (file) {
        const blobData = await fileToBlob(file, fileType);
        await s3Mutate({ uploadUrl: res.data.uploadUrl, blobData: blobData });
        await editTodo({
          id: query.id as string,
          title: String(title),
          description: String(description),
          categoryId: Number(categoryId),
          imageUrl: res.data.url || (query.imageUrl as string),
        });
      } else {
        await editTodo({
          id: query.id as string,
          title: String(title),
          description: String(description),
          categoryId: Number(categoryId),
        });
      }
    },

    onError: (error: any) => {
      console.log(error);
    },
  });

  const handleOnSubmit = () => {
    updateTodoWithImage({});
  };

  const handleImageDeselect = () => {
    setFile(null);
    setFileType("");
  };

  return (
    <>
      <div className="container">
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="error-message">
          {!title ? <div>Title required</div> : ""}
        </div>
        <textarea
          className="text-area"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="error-message">
          {!description ? <div>Description required</div> : ""}
        </div>
        <div className="App">
          <input type="file" onChange={handleImageSelect} />
          {file && (
            <div>
              <img src={file} alt="Selected Image" />
              <button onClick={handleImageDeselect}>X</button>
            </div>
          )}
        </div>

        <div>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
            }}
          >
            {categoryData &&
              categoryData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <button className="btn-submit" onClick={handleOnSubmit}>
          Submit
        </button>
      </div>
    </>
  );
};

export default EditTodo;
