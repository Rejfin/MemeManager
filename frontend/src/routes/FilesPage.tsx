import FileRoll from "../components/files_page/FileRoll";
import SearchComponent from "../components/files_page/SearchComponent";
import { Meme } from "../models/meme.model";

const listOfFiles: Meme[] = [];

const FilesPage = () => {
  return (
    <>
      <div className="flex-row h-full bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md p-4">
        <div className="pb-4">
          <SearchComponent />
        </div>
        <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
          <FileRoll files={listOfFiles} date={new Date(2022, 11, 12)} />
          <FileRoll files={listOfFiles} date={new Date(2022, 11, 13)} />
          <FileRoll files={listOfFiles} date={new Date(2022, 11, 14)} />
          <FileRoll files={listOfFiles} date={new Date(2022, 11, 15)} />
        </div>
      </div>
    </>
  );
};

export default FilesPage;
