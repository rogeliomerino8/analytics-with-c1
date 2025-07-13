import { Button } from "@crayonai/react-ui";
import Image from "next/image";

export const ErrorScreen = () => {
  const tryAgainHandler = () => {
    document.location.href = "/";
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-xl bg-container">
      <div className="flex flex-col items-center gap-l">
        <Image src="/error.svg" alt="Error" width={48} height={48} />
        <h1 className="font-semibold text-2xl text-primary">Oops.</h1>
      </div>
      <p className="text-secondary">
        We ran into a problem while processing your request.
      </p>
      <Button variant="secondary" size="medium" onClick={tryAgainHandler}>
        Try again
      </Button>
    </div>
  );
};
