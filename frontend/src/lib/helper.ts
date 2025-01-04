export function formatDate(date: Date) {
    return date.toLocaleDateString("en-GB", { dateStyle: "medium" })
}

export function formattedDate(d1: string, d2: string | null) {
    const D1 = new Date(d1);
    if (d2 === null) return formatDate(D1);
    const D2 = new Date(d2);
    if (D1.getDate() != D2.getDate()) {
        return formatDate(D1) + " - " + formatDate(D2)
    }
    return formatDate(D1)
}