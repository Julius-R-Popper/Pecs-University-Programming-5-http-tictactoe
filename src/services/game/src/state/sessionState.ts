let hostIp: string | null = null;
let guestIp: string | null = null;

export function getSessionHost() {
    return hostIp;
}

export function getSessionGuest() {
    return guestIp;
}

export function setGuestIp(ip: string) {
    if (guestIp) throw new Error("Remote already connected");
    guestIp = ip;
}

export function setHostIp(ip: string) {
    if (hostIp) throw new Error("Host already connected");
    hostIp = ip;
}

export function getSession() {
    return { hostIp, guestIp };
}

export function resetSession() {
    hostIp = null;
    guestIp = null;
}
