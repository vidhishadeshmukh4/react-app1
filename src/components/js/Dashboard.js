import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Dashboard.css'; // Ensure you have a CSS file for styling
import logo from '../images/logo.png';
import mainImage from '../images/main-image.png';
import axios from 'axios';
import bimage from '../images/image.png';

function Dashboard() {
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [firstName, setFirstName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem('username'); // Get username from localStorage
        console.log('Username from localStorage:', username);

        if (username) {
            axios.get('http://localhost:3008/api/get-first-name', {
                params: { username }
            })
            .then(response => {
                console.log('First name fetched:', response.data.first_name);
                if (response.data.first_name) {
                    setFirstName(response.data.first_name); // Update state
                }
            })
            .catch(error => {
                console.error('Error fetching first name:', error);
            });
        } else {
            console.log('No username found in localStorage');
        }
    }, []); // Empty dependency array means this runs once after the initial render

    const handleLogout = () => {
        // Clear any authentication tokens or local storage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        setIsLoggedOut(true);
        setTimeout(() => {
            navigate('/');
        }, 2000); // Redirect after 2 seconds
    };

    return (
        <div className="dashboard-container">
            <header>
                <div className="logo">
                    <div className="lgo">
                    <img src={logo} alt="Logo" />
                    </div>
                    <div class="grrt">
                    <span className="greeting">Hi {firstName} !!!</span> {/* Display the first name here */}
                    </div>
                </div>
                <nav className="navbar">
                    <a href=""><b>Home</b></a>
                    <Link to="/place-order"><b>Place Order</b></Link>
                    <a href="/view-bills"><b>Bills and Order Details</b></a>
                    <a href="#logout" onClick={handleLogout}><b>Logout</b></a>
                </nav>
                
            </header>
            <div className="main-image">
                <img src={mainImage} alt="Main Image" />
            </div>
            {isLoggedOut && (
                <div className="logout-message">
                    <div className="message-content">
                        <span className="tick-mark">✔</span>
                        Logged out successfully
                    </div>
                </div>   
            )}
             <div className='ads'>
             <img src={bimage} alt="design" />
             <h1>Deals of the Day</h1>
             <section className="discount-section">
              
    <div className="discount-item">
    
        <img src="https://themes.muffingroup.com/be/icecream2/wp-content/uploads/2019/09/icecream2-ourproducts-pic5.png" alt="Organic Cream" />
        <div className="discount-details">
            <h2>40% OFF</h2>
            <h3>Chocolate Scoop</h3>
        
        </div>
    </div>
    <div className="discount-item">
        <img src="https://themes.muffingroup.com/be/icecream2/wp-content/uploads/2019/09/icecream2-ourproducts-pic6.png" alt="Flavour Cream" />
        <div className="discount-details">
            <h2>60% OFF</h2>
            <h3>Strawberry Cone</h3>
            
        </div>
    </div>
</section>
</div>


{/* <div className='nextsec'>
    
</div> */}

 </div>
    );
}

export default Dashboard;
