export type EntryPoint = {
  label?: string;
  directory?: string;
  origin: string;
  readOnly?: boolean;
  icon?: string;
  webPrefix?: string;
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
  originalSelection?: (string | File)[];
  themePrefix?: string;
  injectCssVars?: boolean;
  form?: FormPreviewOptions;
};

export type FormPreviewOptions = {
  type?: "image" | "file";
  filter?: string;
};

export type File = {
  id?: string;
  liipId: string;
  mimeGroup: string;
  mimeType: string;
  filename: string;
  directory: string;
  origin: string;
  imageWidth?: number;
  imageHeight?: number;
  type: "dir" | "file";
  size: number;
  updatedAt: string;
  icon: string;
  public: boolean;
  uploadRelativePath: string;
  absolutePath?: string;
  empty: boolean;
};

export type FileManagerType = {
  destroy: () => void;
};

export type FileManagerModalType = {
  destroy: () => void;
}

export type TextFormFilePicker = {
  destroy: () => void;
}

export type EntityFormFilePicker = {
  destroy: () => void;
}

declare function fileManager(
  elt: HTMLElement | string,
  options: FileManagerOptions
): FileManagerType;

declare function fileManagerModal(
  options: FileManagerOptions,
  onSuccess: (files: File[]) => void,
  onAbort: () => void
): FileManagerModalType;

declare function textFormFilePicker(
  inputElt: HTMLElement | string,
  options: FileManagerOptions,
  files: File[],
  selectionChangeCallback: () => void | undefined
): TextFormFilePicker;

declare function entityFormFilePicker(
  inputElt: HTMLElement | string,
  options: FileManagerOptions,
  files: File[],
): EntityFormFilePicker;

export {fileManager, fileManagerModal, textFormFilePicker, entityFormFilePicker};
