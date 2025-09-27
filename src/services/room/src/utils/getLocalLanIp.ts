import os from "os";

export function getLocalLanIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]!) {
            if (iface.family === "IPv4" && !iface.internal) {
                // if (iface.address.startsWith("192.168.")) {
                //     return iface.address;
                // }
                return iface.address;
            }
        }
    }
    return "0.0.0.0";
}
