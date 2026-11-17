import {Link} from 'react-router-dom'

// Show the application title and provide a client-side link back to the home page.
const Navbar = () => {

    return (
        <header>
            <div className="container">
                <Link to= "/">
                    <h1>Calamity Donation Management and Pickup Scheduling System</h1>
                </Link>
                <nav aria-label="Main navigation">

                    <Link to="/login">Log in</Link>
                    <Link to="/signup">Sign up</Link>


                </nav>
            </div>
        </header>

    )

}




export default Navbar