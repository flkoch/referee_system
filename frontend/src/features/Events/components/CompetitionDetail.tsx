import { Button, Card, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import { type CompetitionType, type LicenseType } from "../../../lib/types"
import ListGroupItemIfLargerNumber from "./ListGroupItem";
import { extractDay, license } from "../../../lib/helper";
import { handleApply } from "../utils/Competition";

function CompetitionDetail({ competition, licenses }: { competition: CompetitionType, licenses: LicenseType[] }) {
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
                            <ListGroupItem>
                                License: {license(competition.desired_level, licenses)}
                                {competition.desired_level != competition.minimum_level && ` (minimum: ${license(competition.minimum_level, licenses)})`}
                            </ListGroupItem>
                        </ListGroup>
                        <Button onClick={handleApply(competition.id)}>Apply</Button>
                    </Card.Body>
                </Card>
            </Col >
        </>
    )
}

export default CompetitionDetail