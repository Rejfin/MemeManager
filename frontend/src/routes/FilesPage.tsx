import FileRoll from "../components/files_page/FileRoll";
import SearchComponent from "../components/files_page/SearchComponent";
import useFetch from "../hooks/useFetch";
import { Meme } from "../models/meme.model";
import noMemesImg from "../assets/no-memes.webp";
import logo from "../assets/logo.webp";

const listOfFiles: { [date: string]: Meme[] } = {};

const FilesPage = () => {
  let page = 0;

  const latestMemes: { error: any; isPending: any; data: any } = useFetch(
    `/memes?size=20&page=${page}`
  );

  if (Object.keys(listOfFiles).length === 0) {
    if (latestMemes.data != null) {
      latestMemes.data.rows.forEach((meme: Meme) => {
        listOfFiles[new Date(meme.uploadDate).toDateString()] ??= [];
        listOfFiles[new Date(meme.uploadDate).toDateString()].push(meme);
      });
    }
  }

  return (
    <>
      <div className="flex-row h-full bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md p-4">
        <div className="pb-4">
          <SearchComponent />
        </div>
        <div className="h-[calc(100%-3.5rem)] w-full overflow-y-auto flex-row">
          {latestMemes.isPending ? (
            <div className="h-[calc(100%-3.5rem)] w-full">
              <div className="h-[calc(100%-3.5rem)] w-full">
                      <img
                        className="relative m-auto top-[calc(50%-10rem)] left-0 right-0 rounded-full animate-loadingDogo"
                        src={logo}
                        alt="loading"
                      />
                    </div>
            </div>
          ) : (
            <div className="h-[calc(100%-3.5rem)] w-full">
              {Object.keys(listOfFiles).length > 0 && (
                <>
                  {Object.keys(listOfFiles).length > 0 ? (
                    Object.keys(listOfFiles).map(
                      (value: string, key: number, array: string[]) => {
                        return (
                          <div className="pt-4">
                            <FileRoll
                              key={key}
                              files={listOfFiles[value]}
                              date={new Date(value)}
                            />
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="h-[calc(100%-3.5rem)] w-full">
                      <img
                        className="relative m-auto top-[calc(50%-10rem)] left-0 right-0"
                        src={noMemesImg}
                        alt="no memes"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilesPage;
