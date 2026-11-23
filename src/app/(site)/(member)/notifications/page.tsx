"use client";

import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { MemberPageTitle } from "@/components/member/MemberPageTitle";
import { formatDateTime, useSession } from "@/hooks/use-demo";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/actions";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { state, account } = useSession();
  const list = account ? state.notifications.filter((n) => n.accountId === account.id) : [];
  const unread = list.filter((n) => !n.read).length;

  return (
    <div>
      <MemberPageTitle
        title="Notifications"
        text={unread ? `${unread} unread` : "You're all caught up."}
        action={
          <Button variant="outline" size="sm" onClick={markAllNotificationsRead} disabled={!unread}>
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </Button>
        }
      />
      {list.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          text="We'll let you know when someone sends you an interest."
        />
      ) : (
        <ul className="surface divide-y overflow-hidden">
          {list.map((n) => (
            <li
              key={n.id}
              onClick={() => !n.read && markNotificationRead(n.id)}
              className={cn(
                "flex cursor-pointer items-start gap-4 p-5 transition-colors hover:bg-muted/50",
                !n.read && "bg-primary-soft/40",
              )}
            >
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  n.read ? "bg-transparent" : "bg-primary",
                )}
              />
              <div className="flex-1">
                <p className={cn("text-sm", !n.read && "font-semibold")}>{n.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(n.at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
