import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.webp";
import { ReactComponent as Control } from "../../assets/icon-control-navigation.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icon-dashboard.svg";
import { ReactComponent as SettingsIcon } from "../../assets/icon-settings.svg";
import { ReactComponent as ProfileIcon } from "../../assets/icon-profile.svg";
import { ReactComponent as LogoutIcon } from "../../assets/icon-logout.svg";
import { ReactComponent as FilesIcon } from "../../assets/icon-files.svg";
import { ReactComponent as DarkModeIcon } from "../../assets/icon-dark-mode.svg";
import { ReactComponent as LightModeIcon } from "../../assets/icon-light-mode.svg";

interface NavEntry {
  title: string;
  icon: any;
  path?: string;
  func?(): void;
}

const NavElement = (props: { navEntry: NavEntry; navOpen: Boolean }) => {
  const location = useLocation();
  return (
    <NavLink
      className={({ isActive }) =>
        `flex p-2 pl-4 rounded-xl ${
          isActive && props.navEntry.path != null
            ? "bg-primary-300 text-textColor-dark"
            : ""
        } ${
          !isActive || props.navEntry.path == null
            ? "hover:bg-primary-100 hover:dark:bg-background-dark hover:dark:opacity-80"
            : ""
        }`
      }
      to={props.navEntry.path || location.pathname}
      onClick={props.navEntry.func || (() => {})}
    >
      {({ isActive }) => (
        <div className="flex flex-nowrap">
          <props.navEntry.icon
            className={`w-6 ${
              isActive && props.navEntry.path != null
                ? "fill-textColor-dark"
                : "fill-navigationIconColor"
            }`}
          />
          <div
            className={`inline align-middle pl-3 font-medium text-lg origin-left duration-200
                    ${!props.navOpen && " md:hidden"}
                    ${
                      isActive && props.navEntry.path != null
                        ? " text-textColor-dark"
                        : "text-textColor dark:text-textColor-dark"
                    }`}
          >
            {props.navEntry.title}
          </div>
        </div>
      )}
    </NavLink>
  );
};

const SideNavigation = () => {
  const { t } = useTranslation();
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") != null
  );

  const menu = [
    {
      title: t("navigation.dashboard"),
      icon: DashboardIcon,
      path: "/",
    } as NavEntry,
    {
      title: t("navigation.files"),
      icon: FilesIcon,
      path: "files",
    } as NavEntry,
    {
      title: t("navigation.profile"),
      icon: ProfileIcon,
      path: "profile",
    } as NavEntry,
    {
      title: t("navigation.settings"),
      icon: SettingsIcon,
      path: "settings",
    } as NavEntry,
    {
      title: !darkMode ? t("navigation.darkMode") : t("navigation.lightMode"),
      icon: !darkMode ? DarkModeIcon : LightModeIcon,
      func: () => {
        if (localStorage.theme === "dark") {
          localStorage.removeItem("theme");
          document.documentElement.classList.remove("dark");
          setDarkMode(false);
          window.dispatchEvent(new Event("theme"));
        } else {
          localStorage.setItem("theme", "dark");
          document.documentElement.classList.add("dark");
          setDarkMode(true);
          window.dispatchEvent(new Event("theme"));
        }
      },
    } as NavEntry,
    {
      title: t("navigation.logout"),
      icon: LogoutIcon,
      func: () => {
        //logout procedure
      },
    } as NavEntry,
  ];

  return (
    <div
      className={`${
        isNavOpen ? "md:w-64" : "md:w-24"
      } bg-backgroundSurface dark:bg-backgroundSurface-dark p-5 pt-8 relative duration-300`}
    >
      <Control
        className={`hidden dark:fill-textColor-dark md:flex absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${isNavOpen && "rotate-180"}`}
        onClick={() => setIsNavOpen(!isNavOpen)}
      />

      <div className="flex gap-x-4 items-center">
        <img
          src={Logo}
          alt="Logo"
          className={`cursor-pointer w-12 rounded-full duration-500 ${
            isNavOpen && "rotate-[360deg]"
          }`}
        />

        <h1
          className={`text-textColor dark:text-textColor-dark origin-left font-medium text-xl duration-200 ${
            !isNavOpen && "md:scale-0"
          }`}
        >
          {t("appName")}
        </h1>
      </div>

      <ul className="pt-6 pb-6 flex flex-col flex-1 h-[calc(100%-2rem)] [&>*:nth-last-child(2)]:mt-auto">
        {menu.map((entry) => (
          <NavElement navEntry={entry} navOpen={isNavOpen} key={entry.title} />
        ))}
      </ul>
    </div>
  );
};

export default SideNavigation;
