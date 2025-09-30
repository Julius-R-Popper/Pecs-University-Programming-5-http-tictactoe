import internalIp from "internal-ip";

export function getLocalLanIp() {
    return internalIp.internalIpV4Sync() ?? "0.0.0.0";
}
