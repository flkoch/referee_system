import { useQuery } from "@tanstack/react-query"
import { getLicenses, getAddress } from "../../../lib/requests"
import { getExaminations, getProfile } from "../utils/User"
import LoadingIndicator from "../../../components/LoadingIndicator"
import { Card, CardBody, CardHeader, CardText, CardTitle, Stack } from "react-bootstrap"
import { ExamType } from "../../../lib/types"
import { license } from "../../../lib/helper"

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
    const examinationQuery = useQuery({
        queryKey: ['examination', 'user', profileQuery.data?.id],
        queryFn: (obj) => getExaminations(obj.signal),
        enabled: profileQuery?.data?.id != null,
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
                {
                    examinationQuery.data != null &&
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Examinations
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            {examinationQuery.data.map((elem: ExamType) => {
                                return <Examination exam={elem} key={elem.id} />
                            })}
                        </CardBody>
                    </Card>
                }
            </Stack>
        </>
    )
}

function Examination({ exam }: { exam: ExamType }) {
    const licenseQuery = useQuery({
        queryKey: ["licenses"],
        queryFn: (obj) => getLicenses(obj.signal),
    })
    if (licenseQuery.isLoading) return <LoadingIndicator center={false} ></LoadingIndicator>
    if (exam.passed) {
        return <CardText><>{license(exam.license, licenseQuery.data)} ({exam.date}) <i className="bi bi-check text-success" aria-label="passed"></i></></CardText>
    }
    return <CardText><span style={{ color: "gray" }}><>{license(exam.license, licenseQuery.data)} ({exam.date})</></span> <i className="bi bi-x text-danger" aria-label="failed"></i></CardText>
}

export default ProfilePage