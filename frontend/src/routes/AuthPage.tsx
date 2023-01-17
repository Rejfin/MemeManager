import InputField from "../components/global/InputField";
import Logo from "../assets/logo.webp";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useState } from "react";
import AlertDialog from "../components/global/AlertDialog";

const AuthPage = (props: { isRegisterPage: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [dialogText, setDialogText] = useState("");

  const isLoginFieldValid = (): boolean => {
    if (login.length === 0) {
      setLoginError(t("auth.emptyFieldError") || "");
      return false;
    } else if (login.length < 4) {
      setLoginError(t("auth.loginToShortError") || "");
      return false;
    }
    setLoginError("");
    return true;
  };

  const isPasswordFieldValid = (): boolean => {
    if (password.length === 0) {
      setPasswordError(t("auth.emptyFieldError") || "");
      return false;
    } else if (
      props.isRegisterPage &&
      (password.length < 6 ||
        !/[0-9]+/.test(password) ||
        !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password))
    ) {
      setPasswordError(t("auth.passwordError") || "");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const isRepeatedPasswordFieldValid = (): boolean => {
    if (repeatPassword.length === 0) {
      setRepeatPasswordError(t("auth.emptyFieldError") || "");
      return false;
    } else if (repeatPassword !== password) {
      setRepeatPasswordError(t("auth.repeatedPasswordNotMatchError") || "");
      return false;
    }
    setRepeatPasswordError("");
    return true;
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (props.isRegisterPage) {
      if (
        isLoginFieldValid() &&
        isPasswordFieldValid() &&
        isRepeatedPasswordFieldValid()
      ) {
        AuthService.register(login, password)
          .then(() => {
            setLogin("");
            setPassword("");
            setRepeatPassword("");
            navigate("/login");
          })
          .catch((data) => {
            setPassword("");
            setRepeatPassword("");
            if (data.response.status === 400) {
              setDialogText(t("auth.registerError") || "");
            } else if (data.response.status === 403) {
              setDialogText(t("auth.userAlreadyExist") || "");
            } else {
              setDialogText(t("auth.unexpectedAuthError") || "");
            }
          });
      }
    } else {
      if (isLoginFieldValid() && isPasswordFieldValid()) {
        AuthService.login(login, password)
          .then(() => {
            navigate("/");
          })
          .catch((data) => {
            setPassword("");
            if (data.response.status === 401) {
              setDialogText(t("auth.authError") || "");
            } else {
              setDialogText(t("auth.unexpectedAuthError") || "");
            }
          });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* Alert Dialog */}
      {dialogText && (
        <AlertDialog
          title={"Authentication Error"}
          text={dialogText}
          positiveButton={{
            text: "OK",
            func: () => {
              setDialogText("");
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
        <form className="flex flex-col gap-y-4 items-center justify-center pt-5 w-96 max-w-sm">
          <InputField
            id="login"
            inputType={"text"}
            placeholder={t("auth.login")}
            value={login}
            error={loginError}
            onChange={(value) => {
              setLogin(value);
            }}
          />
          <InputField
            id="password"
            inputType={"password"}
            placeholder={t("auth.password")}
            value={password}
            error={passwordError}
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
                error={repeatPasswordError}
                onChange={(value) => {
                  setRepeatPassword(value);
                }}
              />
              <button
                onClick={handleSubmit}
                className="bg-primary-500 text-textColor-dark rounded-lg py-3 w-60"
              >
                {t("auth.register") || ""}
              </button>
            </>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-primary-500 text-textColor-dark rounded-lg py-3 w-60"
            >
              {t("auth.logIn") || ""}
            </button>
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

export default AuthPage;
