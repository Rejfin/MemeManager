import InputField from "../components/global/InputField/InputField";
import Logo from "../assets/logo.webp";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const LoginPage = (props: { isRegisterPage: boolean }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-col items-center w-full h-fit md:w-4/5 md:h-fit md:max-w-3xl bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md p-4">
        <div className="flex items-center justify-center">
          <img src={Logo} alt="Logo" className="rounded-full" />
          <div className="flex flex-col items-start justify-center pl-3">
            <h1 className="text-textColor dark:text-textColor-dark text-3xl font-medium cursor-default">
              {t("appName")}
            </h1>
            <h2 className="text-textColor dark:text-textColor-dark cursor-default">
              {t("appDescription")}
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 items-center justify-center pt-5 max-w-2xl">
          <InputField inputType={"password"} placeholder={t("auth.login")} />
          <InputField inputType={"password"} placeholder={t("auth.password")} />
          {props.isRegisterPage === true ? (
            <>
              <InputField
                inputType={"password"}
                placeholder={t("auth.repeatPassword")}
              />
              <button className="bg-primary-500 text-textColor-dark rounded-lg py-3 w-60">
                {t("auth.register")}
              </button>
            </>
          ) : (
            <button className="bg-primary-500 text-textColor-dark rounded-lg py-3 w-60">
              {t("auth.logIn")}
            </button>
          )}
        </div>
      </div>
      <div className="pt-16">
        {props.isRegisterPage === true ? (
          <>
            <h3 className="inline">{t("auth.alreadyHaveAcc")}</h3>
            <Link to='/login' className="inline text-primary-600 pl-2 cursor-pointer">{t("auth.logIn")}</Link>
          </>
        ) : (
          <>
            <h3 className="inline">{t("auth.dontHaveAcc")}</h3>
            <Link to='/register' className="inline text-primary-600 pl-2 cursor-pointer">{t("auth.createNewAccount")}</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
