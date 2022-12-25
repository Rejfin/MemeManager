import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const SideNavigation = () => {
  const { t } = useTranslation();
  return (
    <div className="h-full w-full px-6 bg-backgroundSurface dark:bg-backgroundSurface-dark">
      <nav className="w-full h-full">
        <div className="h-full relative">
          <div className="w-[100px] h-[100px]">{/* logo */}</div>
          {/* dashboard */}
          <NavLink
            className={({ isActive }) =>
              "block p-2 pl-4 rounded-xl" +
              (isActive ? " bg-primary-300 text-textColor-dark" : "")
            }
            to={"/"}
          >
            {({ isActive }) => (
              <div className="block flex-nowrap">
                <svg
                  className={
                    "inline w-6" +
                    (isActive
                      ? " fill-textColor-dark"
                      : " fill-navigationIconColor")
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                </svg>
                <div
                  className={
                    "inline align-middle pl-3 font-medium text-lg" +
                    (isActive
                      ? " text-textColor-dark"
                      : " text-textColor dark:text-textColor-dark")
                  }
                >
                  {t("navigation.dashboard")}
                </div>
              </div>
            )}
          </NavLink>
          {/* files */}
          <NavLink
            className={({ isActive }) =>
              "block p-2 pl-4 rounded-xl" +
              (isActive ? " bg-primary-300 text-textColor-dark" : "")
            }
            to={"files"}
          >
            {({ isActive }) => (
              <div>
                <svg
                  className={
                    "inline w-6" +
                    (isActive
                      ? " fill-textColor-dark"
                      : " fill-navigationIconColor")
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32v96V384c0 35.3 28.7 64 64 64H256V384H64V160H256V96H64V32zM288 192c0 17.7 14.3 32 32 32H544c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H445.3c-8.5 0-16.6-3.4-22.6-9.4L409.4 9.4c-6-6-14.1-9.4-22.6-9.4H320c-17.7 0-32 14.3-32 32V192zm0 288c0 17.7 14.3 32 32 32H544c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32H445.3c-8.5 0-16.6-3.4-22.6-9.4l-13.3-13.3c-6-6-14.1-9.4-22.6-9.4H320c-17.7 0-32 14.3-32 32V480z" />
                </svg>
                <div
                  className={
                    "inline align-middle pl-3 font-medium text-lg" +
                    (isActive
                      ? " text-textColor-dark"
                      : " text-textColor dark:text-textColor-dark")
                  }
                >
                  {t("navigation.files")}
                </div>
              </div>
            )}
          </NavLink>
          {/* profile */}
          <NavLink
            className={({ isActive }) =>
              "block p-2 pl-4 rounded-xl" +
              (isActive ? " bg-primary-300 text-textColor-dark" : "")
            }
            to={"profile"}
          >
            {({ isActive }) => (
              <div>
                <svg
                  className={
                    "inline w-6" +
                    (isActive
                      ? " fill-textColor-dark"
                      : " fill-navigationIconColor")
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
                <div
                  className={
                    "inline align-middle pl-3 font-medium text-lg" +
                    (isActive
                      ? " text-textColor-dark"
                      : " text-textColor dark:text-textColor-dark")
                  }
                >
                  {t("navigation.profile")}
                </div>
              </div>
            )}
          </NavLink>
          {/* settings */}
          <NavLink
            className={({ isActive }) =>
              "block p-2 pl-4 rounded-xl" +
              (isActive ? " bg-primary-300 text-textColor-dark" : "")
            }
            to={"settings"}
          >
            {({ isActive }) => (
              <div>
                <svg
                  className={
                    "inline w-6" +
                    (isActive
                      ? " fill-textColor-dark"
                      : " fill-navigationIconColor")
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336c44.2 0 80-35.8 80-80s-35.8-80-80-80s-80 35.8-80 80s35.8 80 80 80z" />
                </svg>
                <div
                  className={
                    "inline align-middle pl-3 font-medium text-lg" +
                    (isActive
                      ? " text-textColor-dark"
                      : " text-textColor dark:text-textColor-dark")
                  }
                >
                  {t("navigation.settings")}
                </div>
              </div>
            )}
          </NavLink>
          {/* logout */}
          <NavLink
            className={({ isActive }) =>
              "block p-2 pl-4 rounded-xl absolute bottom-9" +
              (isActive ? " bg-primary-300 text-textColor-dark" : "")
            }
            to={"logout"}
          >
            {({ isActive }) => (
              <div>
                <svg
                  className={
                    "inline w-6" +
                    (isActive
                      ? " fill-textColor-dark"
                      : " fill-navigationIconColor")
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M534.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L434.7 224 224 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM192 96c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-53 0-96 43-96 96l0 256c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                </svg>
                <div
                  className={
                    "inline align-middle pl-3 font-medium text-lg" +
                    (isActive
                      ? " text-textColor-dark"
                      : " text-textColor dark:text-textColor-dark")
                  }
                >
                  {t("navigation.logout")}
                </div>
              </div>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default SideNavigation;
