import React, { useEffect, useState } from 'react';
import '../css/ViewBills.css'; // Assuming you have a CSS file for styling
import { Link } from 'react-router-dom';

const ViewBills = () => {
  const [bills, setBills] = useState([]);
  const [originalBills, setOriginalBills] = useState([]); // Store original bills data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage] = useState(10); // Number of bills to display per page
  const [order, setOrder] = useState('none'); // Default order
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('customer_name'); // Default search column

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('http://localhost:3008/api/bills');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched bills data:', data);
        setBills(data);
        setOriginalBills(data); // Save the original order
      } catch (error) {
        console.error('Error fetching bills:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  useEffect(() => {
    let sortedBills = [...bills];

    if (order === 'asc') {
      sortedBills.sort((a, b) => new Date(a.date) - new Date(b.date)); // Ascending by date
    } else if (order === 'desc') {
      sortedBills.sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending by date
    } else if (order === 'none') {
      // Revert to original order when 'none' is selected
      sortedBills = [...originalBills];
    }

    // Apply search filter
    if (searchTerm) {
      sortedBills = sortedBills.filter(bill => 
        bill[searchColumn] && bill[searchColumn].toString().toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }

    console.log('Sorted and filtered bills data:', sortedBills);
    setBills(sortedBills);
  }, [order, originalBills, searchTerm, searchColumn]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  // Pagination logic
  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(bills.length / billsPerPage);

  console.log('Current bills data:', currentBills);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats the date without time
  };

  return (
    <div className="container">
      <header className="header">
        <h2>View Bills and Placed Order Details</h2>
        <div className="filter-container">
          <label htmlFor="search">Search:</label>
          <input
            type="text"
            id="search"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label htmlFor="searchColumn">Search Column:</label>
          <select
            id="searchColumn"
            name="searchColumn"
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
          >
            <option value="customer_name">Customer Name</option>
            <option value="mob_no">Mobile Number</option>
            <option value="billing_amount">Billing Amount</option>
            <option value="employee_name">Employee Name</option>
          </select>
          <label htmlFor="order">Order by Date:</label>
          <select id="order" name="order" value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="none">None</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <Link to="/dashboard">
            <button id="homeee">🏠</button>
          </Link>
        </div>
      </header>
      <div className="background-container">
        <div className="bills-table-container">
          <table className="bills-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Mobile Number</th>
                <th>Date</th>
                <th>Billing Amount</th>
                <th>Employee Name</th>
              </tr>
            </thead>
            <tbody>
              {currentBills.length > 0 ? (
                currentBills.map((bill, index) => (
                  <tr key={index}>
                    <td>{bill.customer_id}</td>
                    <td>{bill.customer_name}</td>
                    <td>{bill.mob_no}</td>
                    <td>{formatDate(bill.date)}</td>
                    <td>{bill.billing_amount}</td>
                    <td>{bill.employee_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No bills available</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              &lt; Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBills;
