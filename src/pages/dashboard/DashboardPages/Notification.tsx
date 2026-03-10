import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

export type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  time: string;
  read: boolean;
};

export const notificationSeed:  NotificationItem[] = [
  {
    id: 1,
    title: "New Appointment Booked",
    message: "A patient booked an appointment for tomorrow.",
    type: "info",
    time: "5 mins ago",
    read: false,
  },
  {
    id: 2,
    title: "Payment Received",
    message: "You received ₹1500 for a consultation.",
    type: "success",
    time: "20 mins ago",
    read: false,
  },
  {
    id: 3,
    title: "System Alert",
    message: "Low storage warning on your cloud drive.",
    type: "warning",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    title: "New Message",
    message: "Dr. Andrew sent you a message.",
    type: "info",
    time: "2 hours ago",
    read: true,
  },
];

const iconForType: Record<NotificationItem["type"], React.JSX.Element> = {
  info: <Info className="text-blue-500" />,
  success: <CheckCircle className="text-green-500" />,
  warning: <AlertCircle className="text-yellow-500" />,
};

type NotificationListProps = {
  notifications: NotificationItem[];
  compact?: boolean;
  onItemClick?: (item: NotificationItem) => void;
};

export const NotificationList = ({
  notifications,
  compact = false,
  onItemClick,
}: NotificationListProps) => {
  const scrollStyles =
    "overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
  const containerStyles = compact
    ? `max-h-80 space-y-3 ${scrollStyles} pr-1`
    : `space-y-4 max-h-[400px] ${scrollStyles} pr-2`;

  return (
    <div className={containerStyles}>
      {notifications.map((item) => (
        <div
          key={item.id}
          role={onItemClick ? "button" : undefined}
          tabIndex={onItemClick ? 0 : -1}
          onClick={() => onItemClick?.(item)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onItemClick?.(item);
            }
          }}
          className={`flex items-start gap-3 rounded-xl border border-white/10 p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-400/30 hover:bg-white/5 ${
            item.read ? "bg-white/5" : "bg-cyan-500/10"
          } ${onItemClick ? "cursor-pointer" : ""}`}
        >
          <div className="mt-1">{iconForType[item.type]}</div>

          <div className="w-full">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-sm text-slate-100">
                {item.title}
              </h3>

              <Badge
                variant={item.read ? "outline" : "default"}
                className="text-[11px]"
              >
                {item.read ? "Read" : "New"}
              </Badge>
            </div>

            <p className="text-xs text-slate-300 mt-1">{item.message}</p>

            <span className="text-[11px] text-slate-400 mt-2 block">
              {item.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Notification = () => {
  const [notifications, setNotifications] = useState(notificationSeed);
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const markAllRead = () => {
    if (!unreadCount) return;

    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  return (
    <Card className="w-full border-white/10 bg-white/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
            <Bell className="h-6 w-6 text-cyan-300" /> Notifications
          </CardTitle>
          <p className="text-sm text-slate-300">
            Stay updated with the latest alerts
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={markAllRead}
          disabled={!unreadCount}
          className="cursor-pointer"
        >
          Mark all read
        </Button>
      </CardHeader>

      <CardContent>
        <NotificationList notifications={notifications} />
      </CardContent>
    </Card>
  );
};

export default Notification;

