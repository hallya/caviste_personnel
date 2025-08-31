import { SuccessIcon, LoadingIcon, ErrorIcon } from "./index";

interface NotificationIconProps {
  type: "success" | "loading" | "error";
  className?: string;
}

export default function NotificationIcon({
  type,
  className = "w-3 h-3",
}: NotificationIconProps) {
  switch (type) {
    case "success":
      return <SuccessIcon className={className} />;
    case "loading":
      return <LoadingIcon className={className} />;
    case "error":
      return <ErrorIcon className={className} />;
    default:
      return null;
  }
}
