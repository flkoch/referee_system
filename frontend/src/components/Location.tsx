import { ReactNode } from "react";
import { LocationType } from "../lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAddress } from "../lib/requests";

export function LocationAddress({ location, children = <br /> }: { location: LocationType, children?: ReactNode }) {
    const addressQuery = useQuery({
        queryKey: ["address", location.address],
        queryFn: (obj) => getAddress(location.address, obj.signal)
    })
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