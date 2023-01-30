import api from "./api";

const uploadFile = (file: FormData, progressCallback: (uploadProgress: any) => void) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (uploadProgress: any) => progressCallback(uploadProgress)
  }
  return api.post("/memes", file, config);
};

const FileService = {
  uploadFile
};

export default FileService;
