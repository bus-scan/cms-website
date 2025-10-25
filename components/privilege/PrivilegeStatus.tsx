import { PrivilegeStatus as PrivilegeStatusEnum } from "@/lib/types/privilege";

interface PrivilegeStatusProps {
  status: PrivilegeStatusEnum;
  className?: string;
}

export default function PrivilegeStatus({ status, className = "" }: PrivilegeStatusProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case PrivilegeStatusEnum.ACTIVE:
        return { text: "Active", className: "bg-green-100 text-green-800" };
      case PrivilegeStatusEnum.CLOSE:
        return { text: "Close", className: "bg-gray-100 text-gray-800" };
      default:
        return { text: status, className: "bg-gray-100 text-gray-800" };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <span
      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusDisplay.className} ${className}`}
    >
      {statusDisplay.text}
    </span>
  );
}

