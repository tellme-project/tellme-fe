import { DateTime } from "luxon";

export function convertIso(isoDate: string){
    const date = new Date(isoDate);
    const inpTZ = "UTC";
    const outTZ = "Asia/Jakarta";
    
    const inpDateTime = DateTime.fromISO(isoDate, { zone: inpTZ })
    const outDateTime = inpDateTime.setZone(outTZ)

    const resultBeforeFormat = outDateTime.toFormat('yyyy-MM-dd HH:mm:ss')
    const hour = parseInt((resultBeforeFormat.split(' ')[1]).slice(0, 2))
    const hourAfterAdjustment = adjustTimezone(hour)
    const result = resultBeforeFormat.slice(0, 11) + hourAfterAdjustment + resultBeforeFormat.slice(13, 19)
    return result + " WIB"
}

function adjustTimezone(hour: number) {
    // UTC+7 Offset
    const result = ((hour + 7) % 24).toString()
    const stringResult = (result.length == 2)? result: `0${result}`
    return stringResult
}