import { MouseEvent, ReactNode, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import api, { getUser } from "../lib/auth";
import { type CompetitionType, type EventType, type LicenseType } from "../lib/types"
import LoadingIndicator from "../components/LoadingIndicator";
import { LocationAddress } from "../components/Location";
import { AxiosError } from "axios";

function EventDetail() {
    const [event, setEvent] = useState<EventType | null>(null);
    const { pk } = useParams()
    const [licenses, setLicenses] = useState<LicenseType[]>([])
    useEffect(() => {
        api.get(`/api/events/${pk}`)
            .then((res) => res.data)
            .then((data) => setEvent(data))
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to log-in.")
                } else if (error.code == "ERR_CANCELED") {
                    console.info("Redundant request canceled: ", error)
                } else {
                    console.error(error)
                }
            });
        api.get("/api/licenses/")
            .then((res) => res.data)
            .then((data) => setLicenses(data))
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to log-in.")
                } else if (error.code == "ERR_CANCELED") {
                    console.info("Redundant request canceled: ", error)
                } else {
                    console.error(error)
                }
            });
    }, []);

    return (
        <>
            {(event == null) ? <LoadingIndicator size="15rem" /> : <EventDetailRender event={event} licenses={licenses} />}
        </>
    )
}

function EventDetailRender({ event, licenses }: { event: EventType, licenses: LicenseType[] }) {
    function Structure({ children }: { children: ReactNode }) {
        if (event.competitions == undefined || event.competitions == null) {
            return children
        }
        if (event.competitions.length < 2) {
            return children
        }
        return (
            <Container className="px-0 mt-2">
                <Row xs={1} lg={2} className="g-2">
                    {children}
                </Row>
            </Container>
        )
    }
    return (
        <>
            <h1>{event.name}</h1>
            <LocationAddress location={event.location}>
                &nbsp;&ndash;&nbsp;
            </LocationAddress>
            <Structure>
                {event.competitions?.map((elem) => {
                    return <CompetitionDetail competition={elem} licenses={licenses} key={elem.id} />
                })}
            </Structure>
        </>
    )
}
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

function ListGroupItemIfLargerNumber({ children, variable, value = 0 }: { children: ReactNode, variable: number | null, value?: number | null }) {
    if (variable === null) {
        return
    }
    if (value === null || variable > value) {
        return <ListGroupItem>{children}</ListGroupItem>
    }
}
function handleApply(id: number) {
    return async function handlerFunction(_event: MouseEvent) {
        api.post("/api/applications/", { "competition": id, "user": getUser() })
            .then((res) => {
                if (res.status === 201) {
                    toast.success("Your application was received and registered.")
                }
            })
            .catch((error) => {
                if (error.status === 400) {
                    for (const [_key, value] of Object.entries(error.response?.data)) {
                        toast.error(String(value))
                    }
                } else if (error.status === 403) {
                    toast.error("You are not allowed to apply.");
                } else {
                    console.error(error);
                }
            })
    }
}
function extractDay(date: string) {
    const dateObject = new Date(date)
    new Date(date).toLocaleString("en-GB", { "weekday": "long", "day": "numeric", "month": "short" })
    return `${dateObject.toLocaleString("en-GB", { "weekday": "long" })} (${dateObject.toLocaleString("en-GB", { "day": "numeric", "month": "short" })})`
}

function license(id: number, licenses: LicenseType[]) {
    return licenses.find((item) => item.id === id)?.name
}

export default EventDetail