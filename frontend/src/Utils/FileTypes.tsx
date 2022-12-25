export interface FileData {
    id: string;
    name: string;
    size: number;
    createdDate: Date;
    imageLink: string;
  }
  
export interface FileListProps {
    files: FileData[];
}

export interface FileListHistoryProps {
    date: Date;
    files: FileData[];
}