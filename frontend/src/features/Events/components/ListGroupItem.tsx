import { ReactNode } from "react"
import { ListGroupItem } from "react-bootstrap"

function ListGroupItemIfLargerNumber({ children, variable, value = 0 }: { children: ReactNode, variable: number | null, value?: number | null }) {
    if (variable === null) {
        return
    }
    if (value === null || variable > value) {
        return <ListGroupItem>{children}</ListGroupItem>
    }
}

export default ListGroupItemIfLargerNumber