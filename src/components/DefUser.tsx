import { cn } from "@/lib/utils";
import { SVGProps } from "react";

const DefUser = ({
  onClick,
  img,
  className,
}: {
  onClick?: () => void;
  img: string;
  className?: string;
}) => (
  <div
    onClick={onClick}
    className={cn(
      " min-h-7 min-w-7 xs:min-h-10 xs:min-w-10    h-7 w-7 xs:h-10 xs:w-10 flex justify-center transition duration-200 text-slate-900 hover:scale-110 dark:text-slate-100 active:scale-90",
      className
    )}
  >
    {img && <img className="rounded-full" src={img} />}
    {!img && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="bi bi-person-circle"
        viewBox="0 0 16 16"
      >
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
        <path
          fillRule="evenodd"
          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
        />
      </svg>
    )}
  </div>
);
export default DefUser;
