import { ReactHTMLElement, ReactNode } from "react";

const MaxWidthWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={
        className
          ? className + "  w-full  py-5 px-5 flex"
          : " w-full  py-5 px-5 flex"
      }
    >
      {children}
    </div>
  );
};
export default MaxWidthWrapper;
