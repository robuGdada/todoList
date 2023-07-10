import { useTodoAdd } from "@/hooks/useTodoAdd";
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
const CreateTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<any>(null);
  const [fileType, setFileType] = useState("");

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
        const blobData = await fileToBlob(file, fileType);
        await s3Mutate({ uploadUrl: res.data.uploadUrl, blobData: blobData });
        await createTodo({
          title,
          description,
          imageUrl: res.data.url,
        });
        back();
      },
      onError: (error: any) => {
        console.log(error);
      },
    });

  const handleOnSubmit = () => {
    createTodoWithImage({});
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

export default CreateTodo;
