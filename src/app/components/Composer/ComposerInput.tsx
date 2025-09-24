import { IconButton } from "@crayonai/react-ui";
import { ArrowUp, Paperclip, StopCircle } from "lucide-react";
import React, { useRef, useState } from "react";
import { AttachedFile } from "./AttachedFile";
import { FileDragState } from "./FileDragState";
import clsx from "clsx";

interface FileState {
  files: File[];
  totalFileSize: number;
  isAtSizeLimit: boolean;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilesDropped: (files: File[]) => void;
  removeFile: (index: number) => void;
}

interface DragState {
  isDragging: boolean;
  dragHandlers: {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
}

interface ComposerInputProps {
  onSubmit: (text: string) => void;
  isRunning: boolean | undefined;
  onCancel: () => void;
  fileState: FileState;
  dragState: DragState;
  onClearFiles: () => void;
  inputContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const ComposerInput = ({
  inputContainerRef,
  onSubmit,
  isRunning,
  onCancel,
  fileState,
  dragState,
  onClearFiles,
}: ComposerInputProps) => {
  const [textContent, setTextContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const composerDisabled: boolean = Boolean(
    fileState.isAtSizeLimit || dragState.isDragging
  );

  const handleSubmit = async () => {
    if (!textContent.trim() || (isRunning ?? false)) {
      return;
    }

    onSubmit(textContent);
    onClearFiles();
    setTextContent("");
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-m p-m border rounded-[18px] bg-container",
        composerDisabled && "bg-sunk",
        !isFocused && "border-interactive-el",
        isFocused && "border-emphasis",
        dragState.isDragging && "border-[#1882FF] bg-container"
      )}
      {...dragState.dragHandlers}
      ref={inputContainerRef}
    >
      {(fileState.files.length > 0 || dragState.isDragging) && (
        <div className="flex flex-wrap gap-s max-h-[125px] overflow-y-auto">
          {fileState.files.map((file, index) => (
            <AttachedFile
              key={`${file.name}-${index}`}
              file={file}
              onRemove={() => fileState.removeFile(index)}
            />
          ))}
          {dragState.isDragging && (
            <FileDragState onClick={handleFileInputClick} />
          )}
        </div>
      )}

      {fileState.files.length > 0 && (
        <p className="flex self-end items-center justify-between text-xs text-secondary">
          <span className={clsx(fileState.isAtSizeLimit && "text-danger")}>
            {(fileState.totalFileSize / 1024).toFixed(1)}KB
          </span>
          <span className="ml-[0.5ch]">/ 300KB</span>
        </p>
      )}

      <div className="flex items-center justify-between gap-s">
        <input
          type="text"
          placeholder="Type here..."
          className={clsx("flex-1 outline-none", isFocused && "border-primary")}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="flex items-center gap-2xs">
          <div className="relative">
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={fileState.handleFileChange}
              accept=".csv,.xlsx"
            />
            <IconButton
              variant="secondary"
              icon={<Paperclip />}
              onClick={(e) => {
                e.preventDefault();
                handleFileInputClick();
              }}
              disabled={composerDisabled}
              style={{ borderRadius: 10 }}
            />
          </div>
          <IconButton
            variant="primary"
            icon={isRunning ?? false ? <StopCircle /> : <ArrowUp />}
            onClick={isRunning ?? false ? onCancel : handleSubmit}
            disabled={!(isRunning ?? false) && composerDisabled}
            style={{ borderRadius: 10 }}
          />
        </div>
      </div>
    </div>
  );
};
