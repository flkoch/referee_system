export type EventType = {
    name: string;
    id: number;
    info: string;
    location: LocationType;
    competition?: CompetitionType;
    slug: string;
    creator: number | null;
    created: string;
    modified: string;
    start: string;
    end: string | null;
}
export type LocationType = {
    id: number;
    name: string;
    description: string;
    address: AddressType;
}
export type AddressType = {
    street: string;
    house_number: string | null;
    area_code: string | null;
    city: string;
    country: string | null;
}
export type CompetitionType = {

}
export type Notification = {
    id: number;
    type: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
    title: string;
    text: string;
    created: Date;
}