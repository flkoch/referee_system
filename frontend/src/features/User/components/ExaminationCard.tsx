import { Card, CardBody, CardHeader, CardText, CardTitle } from "react-bootstrap"
import { ExamType } from "../../../lib/types"
import { license } from "../../../lib/helper"
import LoadingIndicator from "../../../components/LoadingIndicator"
import { useLicenseQuery } from "../../../hooks/useQueries"
import { useExaminationQuery } from "../hooks/useUserQueries"

function ExaminationCard({ user }: { user: number }) {
    const examinationQuery = useExaminationQuery(user);
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
    const licenseQuery = useLicenseQuery();
    if (licenseQuery.isLoading) return <LoadingIndicator center={false} ></LoadingIndicator>
    if (exam.passed) {
        return <CardText><>{license(exam.license, licenseQuery.data)} ({exam.date}) <i className="bi bi-check text-success" aria-label="passed"></i></></CardText>
    }
    return <CardText><span style={{ color: "gray" }}><>{license(exam.license, licenseQuery.data)} ({exam.date})</></span> <i className="bi bi-x text-danger" aria-label="failed"></i></CardText>
}


export default ExaminationCard