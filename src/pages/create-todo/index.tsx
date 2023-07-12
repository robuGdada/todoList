import { fileToBlob } from "@/utils/fileToBlob";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";

import { useCategoryQuery } from "./useCategoryQuery";
import { useTodoAdd } from "@/hooks/useTodoAdd";
import { useUploadUrl } from "@/hooks/useUploadUrl";

type UploadResponse = {
  message: string;
  data: { uploadUrl: string; url: string };
};

const CreateTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<any>(null);
  const [fileType, setFileType] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { data } = useCategoryQuery();
  const { back } = useRouter();

  const { mutateAsync: createTodo, isLoading: isCreatingTodo } = useTodoAdd();

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
  const { mutateAsync: s3Mutate, isLoading: isUploadingToS3 } = useMutation({
    mutationFn: uploadToS3,
  });

  const [error, setError] = useState<string>("");

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

  const { mutate: createTodoWithImage, isLoading: isCreatingUrl } =
    useUploadUrl({
      onSuccess: async (res: UploadResponse) => {
        if (file) {
          const blobData = await fileToBlob(file, fileType);
          await s3Mutate({ uploadUrl: res.data.uploadUrl, blobData: blobData });
          await createTodo({
            title,
            description,
            categoryId: Number(categoryId),
            imageUrl: res.data.url,
          });
        } else {
          await createTodo({
            title,
            description,
            categoryId: Number(categoryId),
          });
        }
        back();
      },

      onError: (error: any) => {
        console.log(error);
      },
    });

  const handleOnSubmit = () => {
    createTodoWithImage({});
  };

  const removeImage = () => {
    setFile(null);
    setFileType("");
  };

  return (
    <>
      <div className="container">
        {isCreatingUrl ? <div>isCreatingUrl</div> : null}
        {isUploadingToS3 ? <div>isUploadingToS3</div> : null}
        {isCreatingTodo ? <div>isCreatingTodo</div> : null}
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
            <div className="selected-image-container">
              <img src={file} alt="Selected Image" />
              <button className="remove-image" onClick={removeImage}>
                X
              </button>
            </div>
          )}
        </div>
        <div>
          <select
            value={categoryId}
            onChange={(e) => {
              console.log(e.target.value);
              setCategoryId(e.target.value);
            }}
          >
            {data &&
              data.map((category) => (
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

export default CreateTodo;
