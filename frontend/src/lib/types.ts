export type EventType = {
    name: string;
    id: number;
    info: string;
    location: LocationType;
    competitions?: CompetitionType[];
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
    id: number;
    event: number;
    category: number[];
    competition_fields: number | null;
    invitor: number;
    desired_level: number;
    minimum_level: number;
    start: string;
    info: string;
    observers: number | null;
    referees: number | null;
    duration: string;
    application: boolean;
    application_open: string | null;
    application_close: string | null;
    head_referee: number | null;
    modified: string;
}
export type LicenseType = {
    id: number;
    name: string;
    parent?: number;
}

export type ApplicationType = {
    id: number;
    user: number;
    created: string;
    modified: string;
    accommodation?: number;
    accommodation_arrival?: string;
    accommodation_departure?: string;
    accommodation_remark?: string;
    competition: number;
    status: number;
    role?: number;
}

export type UserType = {
    id?: number;
    firstname?: string;
    lastname?: string;
    isAuthenticated?: boolean;
}
export type ThemeLiteral = "light" | "dark";
