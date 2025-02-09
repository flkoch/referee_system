import { Card, CardBody, CardHeader, CardText, CardTitle, Stack } from "react-bootstrap"
import LoadingIndicator from "../../../components/LoadingIndicator"
import { useAddressQuery } from "../../../hooks/useQueries"
import { useProfileQuery } from "../hooks/useUserQueries"
import ApplicationsList from "./ApplicationsCard"
import ExaminationCard from "./ExaminationCard"

function ProfilePage({ pk }: { pk: number }) {
    const profileQuery = useProfileQuery(pk);
    const addressQuery = useAddressQuery(profileQuery?.data?.referee?.address, profileQuery.isFetched);
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