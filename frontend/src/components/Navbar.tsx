import { ReactNode } from "react";
import { Container, Navbar } from "react-bootstrap";

function NavbarBlock({ children }: { children: ReactNode }) {
    return (
        <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
            <Container>
                <Navbar.Brand href="#home">Referee Admin</Navbar.Brand>
                {children}
            </Container>
        </Navbar>
    )
}

export default NavbarBlock