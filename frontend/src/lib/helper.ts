import { LicenseType } from "./types";

export function formatDate(date: Date): string {
    return date.toLocaleDateString("en-GB", { dateStyle: "medium" });
}

export function formattedDateRange(d1: string, d2: string | null): string {
    const D1 = new Date(d1);
    if (d2 === null) return formatDate(D1);
    const D2 = new Date(d2);
    if (D1.getDate() != D2.getDate()) {
        return formatDate(D1) + " - " + formatDate(D2);
    }
    return formatDate(D1);
}

export function extractDay(date: string): string {
    const dateObject = new Date(date);
    new Date(date).toLocaleString("en-GB", { "weekday": "long", "day": "numeric", "month": "short" });
    return `${dateObject.toLocaleString("en-GB", { "weekday": "long" })} (${dateObject.toLocaleString("en-GB", { "day": "numeric", "month": "short" })})`;
}

export function license(id: number, licenses: LicenseType[]) {
    return licenses.find((item) => item.id === id)?.name;
}