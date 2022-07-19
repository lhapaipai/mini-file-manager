export type EntryPoint = {
  label?: string;
  directory?: string;
  origin: string;
  readOnly?: boolean;
  icon?: string;
};

export type FileValidation = {
  mimeGroup?: string;
  allowDir?: boolean;
  imageOptions?: {
    allowSvg?: boolean;
    width?: number;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    ratio?: number;
  }
};

export type FileUpload = {
  maxFileSize?: number;
  fileType: string[];
};

export type FileManagerOptions = {
  endPoint: string;
  entryPoint: EntryPoint[];
  fileValidation?: FileValidation;
  fileUpload?: FileUpload;
  locale?: "en" | "fr" | "custom";
  localeData?: {
    [key: string]: string;
  };
  multiple?: boolean;
  originalSelection?: (string | FileManagerFile)[];
  theme?: string;
};

export type FormPreviewOptions = {
  type?: "image" | "file";
  filter?: string;
  multiple?: boolean;
};

export type FileManagerFile = {
  id: string;
  filename: string;
  directory: string;
  uploadRelativePath: string;
  mimeType: string;
  mimeGroup: string;
  type: "dir" | "file";
  origin: string;
  size: number;
  createdAt: string;
  url: string | null;
  urlTimestamped: string | null;
  icon: string;
  imageWidth?: number;
  imageHeight?: number;
  thumbnails?: {
    [key: string]: string
  }
};

export type FileManagerType = {
  destroy: () => void;
};

export type FileManagerModalType = {
  destroy: () => void;
}

export type FormFilePickerType = {
  destroy: () => void;
}

declare function FileManager(
  elt: HTMLElement | string,
  options: FileManagerOptions
): FileManagerType;

declare function FileManagerModal(
  options: FileManagerOptions,
  onSuccess: (files: FileManagerFile[]) => void,
  onAbort: () => void
): FileManagerModalType;

declare function FormFilePicker(
  inputElt: HTMLElement | string,
  formPreviewOptions: FormPreviewOptions,
  fileManagerOptions: FileManagerOptions,
  files: FileManagerFile[],
  selectionChangeCallback: () => void | undefined
): FormFilePickerType;

export {FileManager, FileManagerModal, FormFilePicker};
