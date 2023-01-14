import InputField from "../components/global/InputField/InputField";
import Logo from "../assets/logo.webp";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useState } from "react";
import AlertDialog from "../components/global/AlertDialog";

const LoginPage = (props: { isRegisterPage: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [errorText, setError] = useState("")

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (props.isRegisterPage) {
      AuthService.register(login, password).then(() => {
        setLogin("");
        setPassword("");
        setRepeatPassword("");
        navigate("/login");
      });
    } else {
      AuthService.login(login, password)
        .then(() => {
          navigate("/");
        })
        .catch((data) => {
          setPassword("");
          setError(data.message)
          setShowAlertDialog(true);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* Alert Dialog */}
      {showAlertDialog && (
        <AlertDialog
          title={"Authentication Error"}
          text={errorText}
          positiveButton={{
            text: "OK",
            func: () => {
              setShowAlertDialog(false);
            },
          }}
        />
      )}

      {/* Main Page */}
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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-4 items-center justify-center pt-5 max-w-2xl"
        >
          <InputField
            id="login"
            inputType={"text"}
            placeholder={t("auth.login")}
            value={login}
            onChange={(value) => {
              setLogin(value);
            }}
          />
          <InputField
            id="password"
            inputType={"password"}
            placeholder={t("auth.password")}
            value={password}
            onChange={(value) => {
              setPassword(value);
            }}
          />
          {props.isRegisterPage === true ? (
            <>
              <InputField
                id="repeatedPassword"
                inputType={"password"}
                placeholder={t("auth.repeatPassword")}
                value={repeatPassword}
                onChange={(value) => {
                  setRepeatPassword(value);
                }}
              />
              <input
                type="submit"
                value={t("auth.register") || ""}
                className="bg-primary-500 text-textColor-dark rounded-lg py-3 w-60"
              />
            </>
          ) : (
            <input
              type="submit"
              value={t("auth.logIn") || ""}
              className="bg-primary-500 text-textColor-dark rounded-lg py-3 w-60"
            />
          )}
        </form>
      </div>
      <div className="pt-16">
        {props.isRegisterPage === true ? (
          <>
            <h3 className="inline text-textColor dark:text-textColor-dark">
              {t("auth.alreadyHaveAcc")}
            </h3>
            <Link
              to="/login"
              className="inline text-primary-600 pl-2 cursor-pointer"
            >
              {t("auth.logIn")}
            </Link>
          </>
        ) : (
          <>
            <h3 className="inline text-textColor dark:text-textColor-dark">
              {t("auth.dontHaveAcc")}
            </h3>
            <Link
              to="/register"
              className="inline text-primary-600 pl-2 cursor-pointer"
            >
              {t("auth.createNewAccount")}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
