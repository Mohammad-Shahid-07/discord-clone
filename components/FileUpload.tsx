import { UploadDropzone } from "@/lib/uploadthing";
import React from "react";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { File, X } from "lucide-react";
import Link from "next/link";
interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}
const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Uploaded Image" className="rounded-full" />
        <button
          className="absolute top-0 right-0 shadow-sm bg-rose-500 text-white rounded-full p-1"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <File className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <Link href={value} className="ml-2 text-indigo-400">
          {value}
        </Link>

        <button
          className="absolute top-0 right-0 shadow-sm bg-rose-500 text-white rounded-full p-1"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={(err) => {
        console.log(err);
      }}
    />
  );
};

export default FileUpload;
