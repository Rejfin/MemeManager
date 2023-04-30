import { Tag } from '../models/tag.model';
import api from './api';

/* eslint-disable  @typescript-eslint/no-explicit-any */
const uploadFile = (file: FormData, progressCallback: (uploadProgress: any) => void) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (uploadProgress: any) => progressCallback(uploadProgress),
  };
  return api.post('/memes', file, config);
};

const updateTags = (fileId: string, tags: Tag[]) => {
  return api.put(`memes/${fileId}`, { tags: tags })
}

const FileService = {
  uploadFile,
  updateTags
};

export default FileService;
