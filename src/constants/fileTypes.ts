export const ALLOWED_FILE_TYPES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export const ALLOWED_FILE_EXTENSIONS = [".csv", ".xlsx"] as const;

export const isFileTypeAllowed = (file: File): boolean => {
  // Check by MIME type
  if (ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number])) {
    return true;
  }

  // Check by file extension
  const fileName = file.name.toLowerCase();
  return ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
};

export const MAX_TOTAL_FILE_SIZE = 300 * 1024; // 300KB in bytes
