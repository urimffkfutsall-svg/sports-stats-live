import React, { useState, useEffect } from "react";
import { ArrowLeft, Bell, BellOff } from "lucide-react";
import { notificationPermissions } from "@/lib/notifications";

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationSupported, setNotificationSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");

  useEffect(() => {
    // Check if notifications are supported
    const supported = notificationPermissions.isSupported();
    setNotificationSupported(supported);

    if (supported) {
      setPermissionStatus(notificationPermissions.getPermission());
      setNotificationsEnabled(notificationPermissions.isEnabled());
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (!notificationSupported) {
      alert("Shfletuesit juaj nuk suporton notifjikimet");
      return;
    }

    if (notificationsEnabled) {
      // Disable notifications
      notificationPermissions.disable();
      setNotificationsEnabled(false);
    } else {
      // Request permission and enable
      const permission = await notificationPermissions.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        setPermissionStatus("granted");
      } else {
        setPermissionStatus(permission);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1830]/10 to-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center gap-4 p-4 max-w-md mx-auto">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} className="text-[#0f1830]" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Cilesimet</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notificationsEnabled ? (
                <Bell size={24} className="text-[#0f1830]" />
              ) : (
                <BellOff size={24} className="text-gray-400" />
              )}
              <div>
                <h2 className="font-semibold text-gray-900">Notifjikimet</h2>
                <p className="text-sm text-gray-600">
                  {notificationsEnabled
                    ? "Notifikimet janë të aktivizuara"
                    : "Aktivizo notifjikimet"}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              disabled={!notificationSupported}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                notificationsEnabled
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-[#0f1830] text-white hover:bg-[#1c3570]"
              } ${!notificationSupported ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {notificationsEnabled ? "Ndal" : "Aktivizo"}
            </button>
          </div>

          {/* Permission Status */}
          {notificationSupported && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">
                Statusi i lejës: <span className="font-semibold">{permissionStatus}</span>
              </p>
              {permissionStatus === "granted" && (
                <p className="text-xs text-green-600">
                  S Ju do të merrni njoftimet përmes shfletuesit
                </p>
              )}
              {permissionStatus === "denied" && (
                <p className="text-xs text-red-600">
                  S Lejet e notifjikimeve janë refuzuar. Kontrolloni cilësimet e shfletuesit.
                </p>
              )}
            </div>
          )}

          {!notificationSupported && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-amber-600">
                a Shfletuesit juaj nuk suporton notifjikimet
              </p>
            </div>
          )}
        </div>

        {/* Notification Info */}
        <div className="bg-[#0f1830]/10 rounded-lg p-4 border border-[#0f1830]/25">
          <h3 className="font-semibold text-[#0f1830] mb-2">!farë do të merrni?</h3>
          <ul className="text-sm text-[#1c3570] space-y-1">
            <li>S Notifjikimet për ndeshjet e përfunduara</li>
            <li>S Lajmet e reja të postuara</li>
            <li>S Videot e reja</li>
            <li>S Skuadrat e reja të shtuara</li>
            <li>S Ndeshjat e reja të planifikuara</li>
          </ul>
        </div>

        {/* Version Info */}
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>FFK Futsall App v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
