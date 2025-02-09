import { useQuery } from "@tanstack/react-query"
import { getAddress } from "../../../lib/requests"
import { getProfile } from "../utils/User"
import LoadingIndicator from "../../../components/LoadingIndicator"
import { Card, CardBody, CardHeader, CardText, CardTitle, Stack } from "react-bootstrap"
import ExaminationCard from "./ExaminationCard"
import ApplicationsList from "./RegistrationsCard"

function ProfilePage({ pk }: { pk: number }) {
    const profileQuery = useQuery({
        queryKey: ["profile", pk],
        queryFn: (obj) => getProfile(pk, obj.signal),
    })
    const addressQuery = useQuery({
        queryKey: ["address", profileQuery.data?.referee?.address],
        queryFn: (obj) => getAddress(profileQuery.data.referee?.address, obj.signal),
        enabled: profileQuery?.data?.referee?.address != null,
    })
    if (profileQuery.isLoading) return <LoadingIndicator size="15rem" />
    return (
        <>
            <h2>{profileQuery.data.first_name} {profileQuery.data.last_name} ({profileQuery.data.username})</h2>
            <Stack gap={2}>
                {addressQuery.data != null &&
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Address
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <CardText>
                                {addressQuery.data.street} {addressQuery.data.house_number}<br />
                                {addressQuery.data.area_code} {addressQuery.data.city}<br />
                                {addressQuery.data.country}
                            </CardText>
                        </CardBody>
                    </Card >
                }
                <ExaminationCard user={profileQuery?.data.id} />
                <ApplicationsList user={profileQuery?.data.id} />
            </Stack>
        </>
    )
}

export default ProfilePage