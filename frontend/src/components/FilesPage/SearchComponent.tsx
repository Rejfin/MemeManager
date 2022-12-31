import {ReactComponent as SearchIcon} from "../../assets/icon-search.svg"

const SearchComponent = () => {
  return (
    <div>
      <div className="inline">
        <input
          className="outline-none focus:outline-2 focus:border-b-2 focus:text-textColor focus:dark:text-textColor-dark border-navigationIconColor bg-background dark:bg-background-dark rounded-md focus:rounded-b-none p-2 pr-9 inline-block"
          type={"text"}
          placeholder={"Search.."}
        />
        <SearchIcon className="w-6 inline-block relative right-12 mb-1 fill-navigationIconColor dark:fill-textColor-dark opacity-60 dark:opacity-60"/>
      </div>
    </div>
  );
};

export default SearchComponent;
