import { Button, Card, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import { type CompetitionType } from "../../../lib/types"
import { extractDay, license } from "../../../lib/helper";
import LoadingIndicator from "../../../components/LoadingIndicator";
import { useLicenseQuery } from "../../../hooks/useQueries";
import { handleApply } from "../utils/Competition";
import ListGroupItemIfLargerNumber from "./ListGroupItem";

function CompetitionDetail({ competition }: { competition: CompetitionType }) {
    const licenseQuery = useLicenseQuery()
    return (
        <>
            <Col>
                <Card>
                    <Card.Header>
                        {extractDay(competition.start)}
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>

                        </Card.Title>
                        <Card.Text>
                            {competition.info}
                        </Card.Text>
                        <ListGroup variant="flush">
                            <ListGroupItemIfLargerNumber variable={competition.competition_fields}>Mats: {competition.competition_fields}</ListGroupItemIfLargerNumber>
                            <ListGroupItemIfLargerNumber variable={competition.referees}>Referees: {competition.referees}</ListGroupItemIfLargerNumber>
                            <ListGroupItemIfLargerNumber variable={competition.observers}>
                                Observers: {competition.observers}
                            </ListGroupItemIfLargerNumber>
                            {(licenseQuery.isLoading) ?
                                <LoadingIndicator /> :
                                <ListGroupItem>
                                    License: {license(competition.desired_level, licenseQuery.data)}
                                    {competition.desired_level != competition.minimum_level && ` (minimum: ${license(competition.minimum_level, licenseQuery.data)})`}
                                </ListGroupItem>
                            }
                        </ListGroup>
                        <Button onClick={handleApply(competition.id)}>Apply</Button>
                    </Card.Body>
                </Card>
            </Col >
        </>
    )
}

export default CompetitionDetail