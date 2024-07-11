import { ReactHTMLElement, ReactNode } from "react";

const MaxWidthWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  console.log(className);
  return (
    <div
      className={`absolute w-full h-full py-5 px-5 flex ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};
export default MaxWidthWrapper;
