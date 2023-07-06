import { Link, useMatch, useResolvedPath } from "react-router-dom"; //Allows page to render only the bits that are changing, not the navbar

const Navbar = () => {
    return(
    <>
        <nav className="nav">
            <ul>
                <CustomLink to="/">Home</CustomLink>
                <CustomLink to="/about">About</CustomLink>
                <CustomLink to="/privacy">Privacy</CustomLink>
                <CustomLink to="/contact">Contact</CustomLink>
            </ul>
        </nav>
        <h1 className="site-title">Arcadify</h1>
    </>)
}

//required in order to dynamically set the class to active/"" for li elements
//simplifies the jsx in the navbar, less repetition of li elemenets
function CustomLink({to, children}){
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path:resolvedPath.pathname, end:true });
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to}>{children}</Link> 
        </li>
    )
}

export default Navbar;