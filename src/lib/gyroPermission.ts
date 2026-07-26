// iOSはDeviceOrientationEventの許可APIを持つが型定義に含まれていないため独自に補う
export type DeviceOrientationEventIOS = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

// 許可が下りた瞬間にParticleBackdrop側へ知らせるためのカスタムイベント名
export const GYRO_PERMISSION_GRANTED_EVENT = "gyro-permission-granted";

// iOS Safari(13+)はタップなどのユーザー操作を起点にしないと許可ダイアログを出せない
export const isGyroPermissionRequired = () =>
  typeof DeviceOrientationEvent !== "undefined" &&
  typeof (DeviceOrientationEvent as DeviceOrientationEventIOS)
    .requestPermission === "function";

export const requestGyroPermission = async (): Promise<boolean> => {
  const DOE = DeviceOrientationEvent as DeviceOrientationEventIOS;
  if (typeof DOE.requestPermission !== "function") return true;

  try {
    const state = await DOE.requestPermission();
    if (state === "granted") {
      window.dispatchEvent(new Event(GYRO_PERMISSION_GRANTED_EVENT));
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
