import FileRoll from "../components/files_page/FileRoll";
import SearchComponent from "../components/files_page/SearchComponent";
import useFetch from "../hooks/useFetch";
import noMemesImg from "../assets/no-memes.webp";
import logo from "../assets/logo.webp";
import UploadMemeDialog from "../components/files_page/UploadMemeDialog";
import { Meme } from "../models/meme.model";
import { useEffect, useRef, useState } from "react";
import {useModal} from '../utils/ModalProvider'
import { useTranslation } from "react-i18next";

const FilesPage = () => {
  const [listOfFiles, setListOfFiles] = useState<Map<string, Meme[]>>(new Map())
  const [page, setPage] = useState(0);
  const {t} = useTranslation()
  const {setModal} = useModal()
  const listInnerRef = useRef<HTMLInputElement | null>(null);
  const [forceRefresh, setForceRefresh] = useState(0);

  const latestMemes: { error: any; isPending: boolean; data: any } = useFetch(
    `/memes?size=20&page=${page}`, forceRefresh
  );

  /**
   * Function responsible for downloading the appropriate amount of data from the api
   * runs so many times until enough data has been downloaded to 
   * display the scroll bar and start infinite pagination
   */
  useEffect(()=>{
    setTimeout(()=> {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current!;
      if(!latestMemes.isPending && ((listInnerRef.current!.scrollHeight <= listInnerRef.current!.clientHeight) || (scrollTop + clientHeight) / scrollHeight >= 0.9)){
        if ((scrollTop + clientHeight) / scrollHeight >= 0.8) {        
            setPage(latestMemes.data.nextPage)
        }
      } 
    }, 100)
    // eslint-disable-next-line
  }, [listInnerRef, listOfFiles])

  /**
   * Function that runs every time new data is downloaded from the api
   * creates a list of files to be displayed by date
   */
  useEffect(()=>{
    if (latestMemes.data != null && latestMemes.data.rows != null) {
      latestMemes.data.rows.forEach((meme: Meme) => {
        if (!listOfFiles.has(new Date(meme.modifiedDate).toDateString())) {
          listOfFiles.set(new Date(meme.modifiedDate).toDateString(), [])
        }
        if(!listOfFiles.get(new Date(meme.modifiedDate).toDateString())!.find(m => m.id === meme.id)){
          listOfFiles.get(new Date(meme.modifiedDate).toDateString())!.push(meme)
        }
      });
      setListOfFiles(new Map(listOfFiles))
    }
    // eslint-disable-next-line
  }, [latestMemes.data])

  /**
   * Props needed to setup modal responsible for uploading files
   */
  const modalProps = {
    onUploadEnds: () => {
      setModal(undefined)
      setListOfFiles(new Map())
      if(page === 0){
        setForceRefresh(forceRefresh + 1)
      }else{
        setPage(0)
      }
    },
    negativeButton: {
      text: t("cancel"),
      func: () => {setModal(undefined)}
    }
  }
  
  const showUploadModal = () => {
    setModal(<UploadMemeDialog {...modalProps}/>)
  }

  /**
   * Function runs every time user scroll page
   * when user is nearly end of files function will download new data if they exist
   */
  const onListScroll = () => {
    if (listInnerRef.current && !latestMemes.isPending) {
      setTimeout(()=>{
        const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current!;
        if ((scrollTop + clientHeight) / scrollHeight >= 0.8) {        
          setPage(latestMemes.data.nextPage)
        }
      }, 150)
    }
  }

  return (
    <div className="flex-row h-full bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md p-4">
      <div className="pb-4 flex">
        <SearchComponent />
        <button onClick={() => showUploadModal()} className="bg-primary-400 rounded-md p-2 text-backgroundSurface">{t("files.addMeme")}</button>
      </div>
      <div className="h-[calc(100%-3.5rem)] w-full overflow-y-auto flex-row" ref={listInnerRef} onScroll={onListScroll}>
        {latestMemes.isPending ? (
          <div className="h-[calc(100%-3.5rem)] w-full">
            <div className="h-[calc(100%-3.5rem)] w-full">
              <img
                loading={'lazy'}
                className="relative m-auto top-[calc(50%-10rem)] left-0 right-0 rounded-full animate-loadingDogo"
                src={logo}
                alt="loading"
              />
            </div>
          </div>
        ) : (
          <div className="h-[calc(100%-3.5rem)] w-full" >
            {listOfFiles.size > 0 ? (
              <>
                {Array.from(listOfFiles).map(data => (
                  <FileRoll
                        key={data[0]}
                        files={data[1]}
                        date={new Date(data[0])}
                  />
                ))}
              </>
            ) : (
              <div className="h-[calc(100%-3.5rem)] w-full">
                <img
                  className="relative m-auto top-[calc(50%-10rem)] left-0 right-0"
                  src={noMemesImg}
                  alt="no memes"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesPage;
