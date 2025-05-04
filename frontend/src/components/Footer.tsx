export function Footer() {
    return (
        <footer className="bg-secondary bg-gradient text-dark mt-5">
            <div className="container py-sm-3 py-xl-4">
                Copyright &copy; {new Date().getFullYear()} by <a href="mailto:florian.koch@sbeo.ch" className="link-dark link-underline-opacity-25 link-underline-opacity-100-hover">Florian Koch</a>
            </div>
        </footer>
    )
}