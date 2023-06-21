import { useEffect, useRef, useState, DragEvent, ChangeEvent } from 'react';
import { ReactComponent as UploadIcon } from '../../assets/icon-file-upload.svg';
import { ReactComponent as RemoveIcon } from '../../assets/icon-delete.svg';
import FileService from '../../services/file.service';
import { useTranslation } from 'react-i18next';

export interface IUploadMemeModalProps {
  negativeButton: {
    text: string;
    func: () => void;
  };
  onUploadEnds: () => void;
}

interface FileToUpload {
  file: File;
  progress: number;
  error?: '';
  finished: boolean;
}

const UploadMemeDialog = (props: IUploadMemeModalProps) => {
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [fileToUploadList, setFileToUploadList] = useState<FileToUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUplading, setIsUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(0);
  const { t } = useTranslation();

  const pickFile = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  /**
   * Handler responsible for handling selected by user files, and adding them to the uploadList
   * @param event - event passed from input element
   */
  const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const filesToUpload = [...(event.target.files || [])].map((file: File) => ({
      file: file,
      progress: 0,
      finished: false,
    }));
    setFileToUploadList((oldFiles) => [...oldFiles, ...filesToUpload]);
  };

  /**
   * Function responsible for removing particular file from upload list
   * @param {number} index - index of file on the list
   */
  const removeFileFromUploadList = (index: number) => {
    setFileToUploadList((oldFiles) => [...oldFiles.filter((_, i) => index !== i)]);
  };

  /**
   * Function used to update percentage of uploading of the file from uploadList
   * @param {number} index - index of file on the list
   * @param {FileToUpload} file - new FileToUpload object with which the function is to replace the object in the list with the given index
   */
  const updateFileOnList = (index: number, file: FileToUpload) => {
    const newList = fileToUploadList.map((f, i) => {
      if (i === index) {
        return { file: file.file, progress: file.progress, error: file.error, finished: file.finished };
      }
      return f;
    });
    if (file.error) {
      setIsUploading(false);
    }
    setFileToUploadList(newList);
  };

  /**
   * Function used for change input file zone when mouse enter it
   * @param event - event passed from input element
   */
  const onMouseEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isUplading) {
      setDragActive(true);
    }
  };

  /**
   * Function used for change input file zone when mouse leave it
   * @param event - event passed from input element
   */
  const onMouseLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  /**
   * Function used for handling file drag and drop
   * @param event - event passed from input element
   */
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files) {
      const filesToUpload = [...event.dataTransfer.files].map((file: File) => ({
        file: file,
        progress: 0,
        finished: false,
      }));
      setFileToUploadList((oldFiles) => [...oldFiles, ...filesToUpload]);
    }
  };

  /**
   * Function used for uploading file one by one from listToUpload,
   * It creates new FormData for every file and add modifiedDate field to request
   */
  useEffect(() => {
    if (uploadingIndex === fileToUploadList.length && fileToUploadList.length > 0) {
      return props.onUploadEnds();
    }

    if (isUplading) {
      const data = new FormData();
      const file = fileToUploadList[uploadingIndex];
      data.append('meme', file.file);
      data.append('modifiedDate', new Date(file.file.lastModified).toISOString());
      FileService.uploadFile(data, (progress) => {
        file.progress = Math.round((progress.loaded * 100) / progress.total);
        file.error = '';
        updateFileOnList(uploadingIndex, file);
      })
        .then(() => {
          const mFile = file;
          mFile.finished = true;
          updateFileOnList(uploadingIndex, mFile);
          setUploadingIndex(uploadingIndex + 1);
        })
        .catch((data) => {
          const mFile = file;
          mFile.error = data.data.message;
          updateFileOnList(uploadingIndex, mFile);
        });
    }
    // eslint-disable-next-line
  }, [uploadingIndex, isUplading, props]);

  return (
    <div className='min-w-[20rem] min-h-[10rem] w-4/5 max-w-xl bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md flex flex-col overflow-hidden'>
      <div className='m-6 flex items-center justify-center'>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onDragEnter={onMouseEnter}
          onDragLeave={onMouseLeave}
          className={`${
            dragActive ? 'bg-primary-100' : 'bg-white'
          } border-primary-600 rounded-md border-dashed border-2 w-11/12 h-52 flex flex-col justify-center text-center`}
        >
          <UploadIcon className='w-24 self-center pointer-events-none fill-textColor dark:fill-textColor-dark' />
          <h3 className={`pt-2 ${dragActive && 'pointer-events-none'} text-textColor dark:text-textColor-dark`}>
            <span
              onClick={() => pickFile()}
              className={`font-semibold ${isUplading ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {t('files.browseFiles')}
            </span>
            {t('files.orDragItHere')}
          </h3>
          <input
            disabled={isUplading}
            onChange={(data) => fileSelectedHandler(data)}
            type='file'
            id='file'
            multiple
            ref={inputFile}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <div className='max-h-64 overflow-auto mb-4'>
        {fileToUploadList.map((file: FileToUpload, index: number) => (
          <div
            title={file.error}
            key={index}
            className='flex flex-row h-12 mx-6 my-1 rounded-md border-primary-600 border-[1px] relative'
          >
            <div
              style={{ width: file.error ? '100%' : file.progress + '%' }}
              className={`bg-opacity-50 absolute left-0 right-0 bottom-0 top-0 ${
                file.error ? ' bg-errorColor' : ' bg-primary-500 '
              }`}
            ></div>
            <div className='group w-full flex flex-row relative'>
              <div
                className={`hidden ${
                  isUplading && 'group-hover:block'
                } absolute top-1/2 -translate-y-1/2 ml-4 text-ellipsis whitespace-nowrap overflow-hidden w-11/12 text-textColor dark:text-textColor-dark`}
              >
                {file.progress > 1 && file.progress < 100 && !file.finished ? t('files.uploading') : ''}
                {file.progress == 100 && !file.finished ? t('files.saving') : ''}
                {file.finished ? t('files.uploaded') : ''}
              </div>
              <div
                className={`${
                  isUplading && file.progress > 1 ? 'group-hover:collapse' : ''
                } my-auto ml-4 text-ellipsis whitespace-nowrap overflow-hidden w-11/12 text-textColor dark:text-textColor-dark`}
              >
                {index + 1}. {file.file.name}
              </div>
              <div className='flex w-1/12 h-full align-middle justify-center mx-2'>
                {!isUplading && file.progress !== 100 && (
                  <RemoveIcon
                    onClick={() => removeFileFromUploadList(index)}
                    className='w-5 fill-errorColor cursor-pointer z-[1]'
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='w-full flex mt-auto min-h-[3rem] items-center justify-center'>
        {props.negativeButton && (
          <button
            hidden={isUplading}
            onClick={props.negativeButton.func}
            className='w-fit rounded-md bg-errorColor bg-opacity-90 mb-4 mr-2 py-1 px-9 text-textColor-dark'
          >
            {props.negativeButton.text}
          </button>
        )}
        <button
          disabled={fileToUploadList.length <= 0 || isUplading}
          onClick={() => setIsUploading(true)}
          className='w-fit rounded-md bg-primary-600 disabled:bg-disableColor dark:disabled:bg-disableDarkColor mb-4 ml-2 py-1 px-9 text-textColor-dark disable:text-textColor'
        >
          {t('files.upload')}
        </button>
      </div>
    </div>
  );
};

export default UploadMemeDialog;
