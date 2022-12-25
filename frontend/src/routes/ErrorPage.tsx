import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error:any = useRouteError();

  return (
    <>
      <div>Page Not Found</div>
      <div>{error.message}</div>
    </>
  );
};

export default ErrorPage;
