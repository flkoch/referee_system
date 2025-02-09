import { useQuery } from "@tanstack/react-query"
import { Card, CardBody, CardHeader, CardText, CardTitle } from "react-bootstrap"
import { getExaminations } from "../utils/User"
import { getLicenses } from "../../../lib/requests"
import LoadingIndicator from "../../../components/LoadingIndicator"
import { ExamType } from "../../../lib/types"
import { license } from "../../../lib/helper"

function ExaminationCard({ user }: { user: number }) {
    const examinationQuery = useQuery({
        queryKey: ['examination', 'user', user],
        queryFn: (obj) => getExaminations(obj.signal),
    })
    if (examinationQuery.data != null) {
        return <Card>
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
    return <LoadingIndicator />
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


export default ExaminationCard