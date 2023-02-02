import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const error: any = useRouteError();

  return (
    <>
      <div>Page Not Found</div>
      <div>{error.message}</div>
    </>
  );
};

export default ErrorPage;
