import { cn } from "@/lib/utils";
import { ReactHTMLElement, ReactNode } from "react";

const MaxWidthWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("  w-full px-2 py-2 xs:py-5 xs:px-5 flex", className)}>
      {children}
    </div>
  );
};
export default MaxWidthWrapper;
