import * as Notifications from "expo-notifications";

export function notify(msg) {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Olive AIoT",
      body: msg,
    },
    trigger: null,
  });
}