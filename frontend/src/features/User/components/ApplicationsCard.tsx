import { ReactElement } from "react";
import { Card, CardBody, CardHeader, CardText, CardTitle, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ApplicationType } from "../../../lib/types";
import { extractTime, formattedDateRange } from "../../../lib/helper";
import LoadingIndicator from "../../../components/LoadingIndicator";
import { LocationAddress } from "../../../components/Location";
import { applicationStatusClass, applicationStatusInfo } from "../../Events/utils/Application";
import { useCompetitionQuery } from "../../Events/hooks/useCompetitionQueries";
import { useApplicationQuery } from "../hooks/useUserQueries";

function ApplicationsList({ user }: { user: number }) {
    const applicationQuery = useApplicationQuery(user)
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
    const competitionQuery = useCompetitionQuery(app.competition)
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