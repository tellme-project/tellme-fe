import { DateTime } from "luxon";

export function convertIso(isoDate: string){
    const date = new Date(isoDate);
    const inpTZ = "UTC";
    const outTZ = "Asia/Jakarta";
    
    const inpDateTime = DateTime.fromISO(isoDate, { zone: inpTZ })
    const outDateTime = inpDateTime.setZone(outTZ)

    return (outDateTime.toFormat('yyyy-MM-dd HH:mm:ss')) + " GMT"
}