import { Loader2Icon } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="w-screen dark:bg-gray-900/80 h-screen flex items-center justify-center">
      <Loader2Icon className="animate-spin"></Loader2Icon>
    </div>
  );
};
export default LoadingPage;
