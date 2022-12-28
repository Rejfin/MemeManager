import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import FileTypeStatCard from "./FileTypeStatCard";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface StorageProps {
  storageSize: number;
  imageSize: number;
  videoSize: number;
  gifSize: number;
  otherSize: number;
}

const StorageStats = (props: StorageProps) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") != null
  );
  const { t } = useTranslation();

  window.addEventListener("theme", () => {
    setDarkMode(localStorage.getItem("theme") != null);
  });

  return (
    <>
      <div className="p-6 flex w-full h-fit justify-center bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md shadow-md">
        <div>
          <div className="text-textColor dark:text-textColor-dark pb-4 text-lg font-medium">
            {t("storage_stats.title")}
          </div>
          <div>
            <CircularProgressbarWithChildren
              value={props.otherSize}
              maxValue={props.storageSize}
              strokeWidth={8}
              background={true}
              backgroundPadding={3}
              className="circular-trail"
              styles={buildStyles({
                pathColor: "#e92229",
                trailColor: darkMode ? "#2b344c" : "#f0f8ff",
                strokeLinecap: "butt",
                backgroundColor: "transparent",
                rotation:
                  (props.imageSize + props.videoSize + props.gifSize) /
                  props.storageSize,
              })}
            >
              <CircularProgressbarWithChildren
                value={props.gifSize}
                maxValue={props.storageSize}
                strokeWidth={10}
                background={true}
                backgroundPadding={2}
                styles={buildStyles({
                  pathColor: "#46e4ff",
                  trailColor: "transparent",
                  strokeLinecap: "butt",
                  backgroundColor: "transparent",
                  rotation:
                    (props.imageSize + props.videoSize) / props.storageSize,
                })}
              >
                <CircularProgressbarWithChildren
                  value={props.videoSize}
                  maxValue={props.storageSize}
                  strokeWidth={12}
                  background={true}
                  backgroundPadding={1}
                  styles={buildStyles({
                    pathColor: "#fcd31a",
                    trailColor: "transparent",
                    strokeLinecap: "butt",
                    backgroundColor: "transparent",
                    rotation: props.imageSize / props.storageSize,
                  })}
                >
                  <CircularProgressbarWithChildren
                    value={props.imageSize}
                    maxValue={props.storageSize}
                    strokeWidth={14}
                    styles={buildStyles({
                      pathColor: "#3990ff",
                      trailColor: "transparent",
                      strokeLinecap: "butt",
                    })}
                  >
                    <div className="font-bold text-3xl md:text-xl lg:text-4xl text-textColor dark:text-textColor-dark">
                      30.4
                    </div>
                    <div className="text-3xl md:text-xl lg:text-xl text-textColor dark:text-textColor-dark">
                      of 120GB
                    </div>
                  </CircularProgressbarWithChildren>
                </CircularProgressbarWithChildren>
              </CircularProgressbarWithChildren>
            </CircularProgressbarWithChildren>
          </div>
          <div>
            <FileTypeStatCard
              name={t("storage_stats.images")}
              image={
                <svg
                  className="w-9 inline-block fill-primary-500 text-primary-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48z" />
                </svg>
              }
              className={"py-4"}
            />
            <FileTypeStatCard
              name={t("storage_stats.videos")}
              image={
                <svg
                  className="w-9 inline-block fill-videoColor text-videoColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M448 32H361.9l-1 1-127 127h92.1l1-1L453.8 32.3c-1.9-.2-3.8-.3-5.8-.3zm64 128V96c0-15.1-5.3-29.1-14-40l-104 104H512zM294.1 32H201.9l-1 1L73.9 160h92.1l1-1 127-127zM64 32C28.7 32 0 60.7 0 96v64H6.1l1-1 127-127H64zM512 192H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192z" />
                </svg>
              }
            />
            <FileTypeStatCard
              name={t("storage_stats.gifs")}
              image={
                <svg
                  className="w-9 mr-2 inline-block fill-gifsColor text-gifsColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M64 0C28.7 0 0 28.7 0 64V288H112c6.1 0 11.6 3.4 14.3 8.8L144 332.2l49.7-99.4c2.7-5.4 8.2-8.8 14.3-8.8s11.6 3.4 14.3 8.8L249.9 288H320c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-6.1 0-11.6-3.4-14.3-8.8L208 275.8l-49.7 99.4c-2.7 5.4-8.3 8.8-14.3 8.8s-11.6-3.4-14.3-8.8L102.1 320H0V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0z" />
                </svg>
              }
              className={"py-4"}
            />
            <FileTypeStatCard
              name={t("storage_stats.other")}
              image={
                <svg
                  className="w-9 inline-block fill-otherColor text-otherColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M0 64C0 28.65 28.65 0 64 0H229.5C246.5 0 262.7 6.743 274.7 18.75L365.3 109.3C377.3 121.3 384 137.5 384 154.5V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM336 448V160H256C238.3 160 224 145.7 224 128V48H64C55.16 48 48 55.16 48 64V448C48 456.8 55.16 464 64 464H320C328.8 464 336 456.8 336 448z" />
                </svg>
              }
              className={"pb-4"}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default StorageStats;
