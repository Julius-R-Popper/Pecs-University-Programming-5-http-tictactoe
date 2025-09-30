import {getSessionGuest, getSessionHost} from "../state/sessionState";

export function checkIpValidity(ip : string){
    return ip == getSessionHost() || ip == getSessionGuest();
}

export function checkTurnByIp(ip : string){
    return ip == getSessionHost() ? "HOST" : "GUEST";
}