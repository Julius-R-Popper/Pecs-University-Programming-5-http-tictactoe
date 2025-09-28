let hostIp: string | null = null;
let remoteIp: string | null = null;

export function getSessionHost() {
    return hostIp;
}

export function getSessionGuest() {
    return remoteIp;
}

export function setRemoteIp(ip: string) {
    if (remoteIp) throw new Error("Remote already connected");
    remoteIp = ip;
}

export function setHostIp(ip: string) {
    if (hostIp) throw new Error("Host already connected");
    hostIp = ip;
}

export function getSession() {
    return { hostIp, remoteIp };
}

export function resetSession() {
    hostIp = null;
    remoteIp = null;
}
