/** @format */

"use client";

import { DashboardStats } from "@/types";
import moment from "moment";
import {
  BeakerIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

interface RecentActivitiesProps {
  activities: DashboardStats["recent_activities"];
}

const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "examination":
        return ClipboardDocumentListIcon;
      case "prediction":
        return BeakerIcon;
      default:
        return ClipboardDocumentListIcon;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "examination":
        return "text-primary";
      case "prediction":
        return "text-secondary";
      default:
        return "text-neutral";
    }
  };

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="card-title">Aktivitas Terbaru</h3>

        {activities && activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const Icon = getIcon(activity.type);
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-base-200 flex items-center justify-center`}
                  >
                    <Icon
                      className={`h-5 w-5 ${getIconColor(activity.type)}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{activity.title}</h4>
                    <p className="text-xs text-base-content/70">
                      {activity.description}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {moment(activity.timestamp).fromNow()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-base-content/60">Belum ada aktivitas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
