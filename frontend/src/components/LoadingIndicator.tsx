import { Spinner } from "react-bootstrap"

function LoadingIndicator({ size = "3rem", center = true }: { size?: string, center?: boolean }) {
    if (center) return (
        <div className="text-center" >
            <Spinner animation="border" role="status" style={{ "width": size, "height": size }}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
    return (
        <Spinner animation="border" role="status" style={{ "width": size, "height": size }}>
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
}

export default LoadingIndicator;