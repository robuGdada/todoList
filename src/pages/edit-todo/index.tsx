import { useTodoUpdate } from "@/hooks/useTodoUpdate";
import { useUploadUrl } from "@/hooks/useUploadUrl";
import { fileToBlob } from "@/utils/fileToBlob";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";

type UploadResponse = {
  message: string;
  data: { uploadUrl: string; url: string };
};

const EditTodo = () => {
  const { query } = useRouter();
  const [title, setTitle] = useState(query.title);
  const [description, setDescription] = useState(query.description);
  const [file, setFile] = useState<any>(null);
  const [fileType, setFileType] = useState("");

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
      const blobData = await fileToBlob(file, fileType);
      await s3Mutate({ uploadUrl: res.data.uploadUrl, blobData: blobData });
      await editTodo({
        id: query.id as string,
        title: String(title),
        description: String(description),
        imageUrl: res.data.url || (query.imageUrl as string),
      });
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const handleOnSubmit = () => {
    updateTodoWithImage({});
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
        <textarea
          className="text-area"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="App">
          <input type="file" onChange={handleImageSelect} />
          <img src={file} />
        </div>
        <button className="btn-submit" onClick={handleOnSubmit}>
          Submit
        </button>
      </div>
    </>
  );
};

export default EditTodo;
