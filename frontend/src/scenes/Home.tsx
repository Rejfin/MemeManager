import StorageStats from "../components/StorageStats";

const home = () => {
  return (
    <div className="grid grid-cols-4">
      <div className="flex bg-primary-300">
        {/* navigation */}
      </div>
      <div className=" flex col-span-2 bg-primary-600">
        {/* recent files */}
      </div>
      <div className="p-2 min-w-[200px]">
        <StorageStats
          storageSize={98756432}
          imageSize={13756432}
          videoSize={8356432}
          gifSize={4356432}
          otherSize={2256432}
        />
      </div>
    </div>
  );
};
export default home;
