import { Meme } from '../models/meme.model';

export interface FileListProps {
  files: Meme[];
}

export interface FileListHistoryProps {
  date: Date;
  files: Meme[];
}
