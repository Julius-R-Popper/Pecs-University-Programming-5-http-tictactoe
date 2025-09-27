import getPort from "get-port";

export async function getFreePortInRange(start = 3001, end = 3999): Promise<number> {
    for (let p = start; p <= end; p++) {
        const free = await getPort({ port: p });
        if (free === p) return p;
    }
    throw new Error(`No free ports in range ${start}-${end}`);
}