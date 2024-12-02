"use client";

import { cn } from "../utils/cn";
import { FileIcon } from "./file-icon";

interface File {
  name: string;
  extension: string;
  size?: string;
  modified?: string;
  url?: string;
}
interface FileListProps {
  files: File[];
}

export default function FileList({ files }: FileListProps) {
  return (
    <div className="w-full">
      <div className="flex gap-3 overflow-x-scroll">
        {files.map((file, index) => (
          <div
            key={index}
            className={` bg-gray-100 cursor-pointer dark:bg-gray-800 min-w-28 ${cn(
              "group relative p-2 rounded-lg border dark:border-gray-900 border-border/50",
              "hover:border-secondary/50 dark:hover:border-secondary/50  hover:shadow-lg transition-all duration-200",
              "bg-card/50 backdrop-blur-sm"
            )}`}
          >
            <div className="flex flex-col items-center space-y-2">
              <FileIcon
                extension={file.extension}
                className="w-10 h-10 text-secondary/80 group-hover:text-secondary"
              />
              <span className="text-sm font-medium text-center break-all line-clamp-2">
                {file.name}
              </span>
              {file.size && (
                <span className="text-xs text-muted-foreground">{file.size}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}