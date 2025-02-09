import { useQuery } from "@tanstack/react-query";
import { Card, CardBody, CardHeader, CardText, CardTitle, OverlayTrigger, Tooltip } from "react-bootstrap";
import { getApplications } from "../utils/User";
import { ApplicationType } from "../../../lib/types";
import LoadingIndicator from "../../../components/LoadingIndicator";
import { getCompetition } from "../../Events/utils/Competition";
import { extractTime, formattedDateRange } from "../../../lib/helper";
import { LocationAddress } from "../../../components/Location";
import { applicationStatusClass, applicationStatusInfo } from "../../Events/utils/Application";
import { ReactElement } from "react";

function ApplicationsList({ user }: { user: number }) {
    const applicationQuery = useQuery({
        queryKey: ['registrations', 'user', user],
        queryFn: (obj) => getApplications(obj.signal),
    })
    if (applicationQuery.isLoading) return <LoadingIndicator />
    if (applicationQuery.data == null) return <></>
    return <>
        <h2 className="mt-5">Applications</h2>
        {applicationQuery.data.map((elem: ApplicationType) => {
            return <Application app={elem} />
        }
        )
        }
    </>
}

function Application({ app }: { app: ApplicationType }) {
    const competitionQuery = useQuery({
        queryKey: ['competiiton', app.competition],
        queryFn: (obj) => getCompetition(app.competition, obj.signal),
    })
    if (competitionQuery.isLoading) return <LoadingIndicator />
    if (competitionQuery.data != null) return <>
        <Card className={applicationStatusClass(app.status)}>
            <CardHeader className={"d-flex justify-content-between"}>
                <CardTitle>{competitionQuery.data.event.name} &ndash; {formattedDateRange(competitionQuery.data.start)} &ndash; {extractTime(competitionQuery.data.start)}</CardTitle>
                <div>
                    <OverlayTrigger placement="left" delay={{ show: 250, hide: 500 }} overlay={renderTooltip(app.status)}><i className="bi bi-info-circle" aria-label={applicationStatusInfo(app.status)}></i></OverlayTrigger>
                </div>
            </CardHeader>
            <CardBody>
                <CardText>{<LocationAddress location={competitionQuery.data.event.location}>&nbsp;&ndash;&nbsp;</LocationAddress>}</CardText>
                <CardText>{competitionQuery.data.info}</CardText>
            </CardBody>
        </Card>
    </>
    return <></>
}

function renderTooltip(code: number) {
    return function (props: object): ReactElement {
        return <Tooltip {...props}>
            {applicationStatusInfo(code)}
        </Tooltip>;
    }
}

export default ApplicationsList