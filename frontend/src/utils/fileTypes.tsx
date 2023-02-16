import { Meme } from '../models/meme.model';

export interface FileListProps {
  files: Meme[];
}

export interface FileListHistoryProps {
  date: Date;
  files: Meme[];
  onFileClick?: (fileId: string, src: string, width: number, height: number, type: string, blurhash?: string) => void;
}
