import { ReactNode } from "react";
import { LocationType } from "../lib/types";
import { useAddressQuery } from "../hooks/useQueries";

export function LocationAddress({ location, children = <br /> }: { location: LocationType, children?: ReactNode }) {
    const addressQuery = useAddressQuery(location.address)
    if (addressQuery.isLoading) return <>{location.name}</>
    return (
        <>
            {location.name}{children}
            {addressQuery.data.street} {addressQuery.data.house_number}{children}
            {addressQuery.data.area_code} {addressQuery.data.city}{children}
            {addressQuery.data.country}
        </>
    )
}