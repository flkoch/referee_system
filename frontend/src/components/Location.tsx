import { ReactNode } from "react";
import { LocationType } from "../lib/types";

export function LocationAddress({ location, children = <br /> }: { location: LocationType, children?: ReactNode }) {
    return (
        <>
            {location.name}{children}
            {location.address.street} {location.address.house_number}{children}
            {location.address.area_code} {location.address.city}{children}
            {location.address.country}
        </>
    )
}