import { ReactNode, } from "react"
import { Container, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { LocationAddress } from "../../../components/Location";
import CompetitionDetail from "./CompetitionDetail";
import { getEvent } from "../utils/Events";
import { CompetitionType } from "../../../lib/types";
import LoadingIndicator from "../../../components/LoadingIndicator";

function EventDetailRender({ pk }: { pk: number }) {
    const eventQuery = useQuery({
        queryKey: ["event", pk],
        queryFn: (obj) => getEvent(pk, obj.signal),
        staleTime: 1000 * 60 * 10,
    })

    function Structure({ children }: { children: ReactNode }) {
        if (eventQuery.data.competitions == undefined || eventQuery.data.competitions == null) {
            return children
        }
        if (eventQuery.data.competitions.length < 2) {
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
    if (eventQuery.isLoading) return <LoadingIndicator size="15rem" />;
    return (
        <>
            <h1>{eventQuery.data.name}</h1>
            <LocationAddress location={eventQuery.data.location}>
                &nbsp;&ndash;&nbsp;
            </LocationAddress>
            <Structure>
                {eventQuery.data.competitions?.map((elem: CompetitionType) => {
                    return <CompetitionDetail competition={elem} key={elem.id} />
                })}
            </Structure>
        </>
    )
}

export default EventDetailRender