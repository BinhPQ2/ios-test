import { useEffect, useRef, useState } from "react";
import { LuPencil, LuSave } from "react-icons/lu";
import { partial } from "filesize";
import { FaTriangleExclamation } from "react-icons/fa6";

export function AlertMessage({
  title = "",
  message = "",
  type = "warning",
  duration = 3000,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [displayMessage] = message.split("|");

  useEffect(() => {
    setIsVisible(true);
    // Skip setting a timeout if duration is not a valid number
    if (!Number.isFinite(duration) || duration <= 0) return;

    // Set timer to hide the message
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    // Clear timeout on unmount or when message changes
    return () => clearTimeout(timer);
  }, [message, duration]);

  // Don't render anything if not visible
  if (!isVisible) return null;

  const colors = {
    warning: {
      bg: "bg-yellow-50",
      icon: "text-yellow-400",
      title: "text-[#9D5425]",
      text: "text-yellow-700",
    },
    error: {
      bg: "bg-red-50",
      icon: "text-red-400",
      title: "text-red-800",
      text: "text-red-700",
    },
  };

  const style = colors[type] || colors.warning;

  return (
    <div
      className={`rounded-md ${
        style.bg
      } p-4 mt-2 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex">
        <div className="shrink-0">
          <FaTriangleExclamation
            aria-hidden="true"
            className={`size-4 ${style.icon}`}
          />
        </div>
        <div className="ml-3">
          {title ? (
            <>
              <p className={`body-small-bold ${style.title}`}>{title}</p>
              <div className="mt-2 body-small-regular">
                <p>{displayMessage}</p>
              </div>
            </>
          ) : (
            <p className={`body-small-bold ${style.title}`}>{displayMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function DropOverlay({ onFileDrop }) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      dragCounter.current++;
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      dragCounter.current = 0;

      const fileList = e.dataTransfer.files;
      if (fileList && fileList.length > 0) {
        onFileDrop(Array.from(fileList));
      }
    };

    const handleDragOver = (e) => e.preventDefault();

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragOver);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragOver);
    };
  }, [onFileDrop]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/40 backdrop-blur-sm z-50 transition-opacity duration-300" />
  );
}

export function formatBytes(bytes) {
  const trimBytes = parseFloat(bytes);
  // if (typeof bytes !== "number" || isNaN(bytes)) return "0 B";
  const size = partial({
    standard: "jedec",
    exponent: 2,
    round: 2,
    spacer: " ",
  });
  return size(trimBytes);
}

/**
 * Adds new files to the current list (up to 10MB),
 * renames duplicates with "(2)", "(3)", etc.,
 * and calls onUpdate with the final file list.
 */
export async function handleNewFiles({
  newFiles,
  currentFiles,
  maxSize = 10 * 1024 * 1024, // 10MB by default
  onUpdate,
  onError,
}) {
  let updatedFiles = [...currentFiles];
  let newlyAddedFiles = [];
  let currentTotal = updatedFiles.reduce((acc, f) => acc + f.size, 0);

  for (const file of newFiles) {
    if (currentTotal + file.size > maxSize) {
      onError?.(`Maximum upload limit reached 10MB.|${Date.now()}`);
      continue;
    }

    // Generate a unique name if this file name already exists
    const uniqueName = getUniqueFileName(file.name, updatedFiles);

    // Create a new File object with the unique name
    const renamedFile = new File([file], uniqueName, { type: file.type });

    updatedFiles.push(renamedFile);
    newlyAddedFiles.push(renamedFile);
    currentTotal += renamedFile.size;
  }

  // Update the parent component (or global state) with the new file list
  await onUpdate?.(updatedFiles, newlyAddedFiles);
}

export function getUniqueFileName(originalName, existingFiles) {
  const extIndex = originalName.lastIndexOf(".");
  const baseName =
    extIndex !== -1 ? originalName.slice(0, extIndex) : originalName;
  const extension = extIndex !== -1 ? originalName.slice(extIndex) : "";

  let counter = 2;
  let newName = originalName;

  while (existingFiles.some((f) => f.name === newName)) {
    newName = `${baseName}(${counter})${extension}`;
    counter++;
  }

  return newName;
}

export function modifyFileName(name, maxLength = 20, lastChars = 6) {
  // TODO: Adjust based on screen width
  const extIndex = name.lastIndexOf(".");
  const extension = extIndex !== -1 ? name.slice(extIndex) : "";
  const baseName = extIndex !== -1 ? name.slice(0, extIndex) : name;

  if (baseName.length > maxLength) {
    return `${baseName.slice(0, maxLength - lastChars)}...${baseName.slice(
      -lastChars
    )}${extension}`;
  }

  return name;
}

export function handleCopy(text, setCopied) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000); // Reset after 1 seconds
  });
}

export function EditToggleButton({ isEditing, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="custom-btn-link-alike body-medium-regular"
    >
      {isEditing ? (
        <>
          <LuSave className="mr-1" /> Save
        </>
      ) : (
        <>
          <LuPencil className="mr-1" /> Edit
        </>
      )}
    </button>
  );
}
