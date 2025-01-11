import { type EventType } from "../../../lib/types";
import { formattedDateRange } from "../../../lib/helper";
import { getRequest } from "../../../lib/api";

function includes(text: string, fields: string[]) {
    const lowerCaseText = text.toLowerCase()
    for (var i = 0; i < fields.length; i++) {
        if (fields[i].toLowerCase().includes(lowerCaseText)) return true;
    }
    return false;
}
export function filterWrapperText(text: string) {
    if (text.length == 0) return (_event: EventType) => true;
    return (event: EventType) => {
        return includes(text, [ // search in the following fields
            event.name,
            event.info,
            formattedDateRange(event.start, event.end),
            event.location.name,
            event.location.address.city,
        ])
    };
}

export async function getEvents(signal: AbortSignal) {
    return getRequest("/api/events/future/", signal)
}

export async function getEvent(pk: number, signal: AbortSignal) {
    return getRequest(`/api/events/${pk}`, signal)
}

export async function getLicenses(signal: AbortSignal) {
    return getRequest("api/licenses/", signal)
}