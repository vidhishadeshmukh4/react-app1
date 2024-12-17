import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/FlavoursTable.css'; // Import the CSS file

const FlavoursTable = ({ onSelectFlavour, searchTerm, selectedCategory }) => {
  const [flavours, setFlavours] = useState([]);
  const [filteredFlavours, setFilteredFlavours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    let url = 'http://localhost:3008/api/flavours';
    if (selectedCategory) {
      url += `?category=${selectedCategory}`;
    }

    axios.get(url)
      .then(response => {
        setFlavours(response.data);
        setFilteredFlavours(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the flavours!", error);
      });
  }, [selectedCategory]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredFlavours(flavours.filter(flavour =>
        flavour.flavour.toLowerCase().startsWith(searchTerm.toLowerCase())
      ));
      setCurrentPage(1); // Reset to first page when search term changes
    } else {
      setFilteredFlavours(flavours);
    }
  }, [searchTerm, flavours]);

  // Calculate the entries to be displayed based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFlavours = filteredFlavours.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredFlavours.length / itemsPerPage);

  // Handler for page change
  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handler for selecting a flavour
  const handleFlavourSelect = (flavour) => {
    console.log('Selected flavour:', flavour);
    onSelectFlavour({
      flavour: flavour.flavour,
      category: flavour.category,
      ProductID: flavour.ProductID
    });
  };

  return (
    <div className="fl">
      <h2>Flavours</h2>
      <table className="flavours-table">
        <thead>
          <tr>
            <th>Flavour</th>
          </tr>
        </thead>
        <tbody>
          {currentFlavours.length > 0 ? (
            currentFlavours.map((flavour, index) => (
              <tr key={index} onClick={() => handleFlavourSelect(flavour)}>
                <td>{flavour.flavour}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="1">No flavours found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default FlavoursTable;
