import '../css/Apppr.css';
import React, { useState, useEffect } from 'react';
import img1 from '../images/img1.png';
import FlavoursTable from './FlavoursTable';
import Invoice from './Invoice';
import InvoicePreview from './InvoicePreview'; // Import the preview component
import axios from 'axios';
import { Link } from 'react-router-dom';

function App() {
  
  const initialState = {
    selectedFlavour: '',
    price: '',
    quantity: '',
    amount: '',
    items: [],
    customerName: '',
    customerContact: '',
    customerAddress: '',
    invoiceNumber: 1, // Initialize invoice number
    selectedCategory: '', // Add selectedCategory to the state

  };

  const [formData, setFormData] = useState(initialState);
  const [editIndex, setEditIndex] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [showPreview, setShowPreview] = useState(false); // State for print preview visibility
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [productTypes, setProductTypes] = useState([]); // State for product types
  const [userId, setUserId] = useState(null); // State to store user_id


  useEffect(() => {
    // Fetch product types from the backend
    axios.get('http://localhost:3008/api/product-types')
      .then(response => {
        setProductTypes(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the product types!", error);
      });

    // Fetch user_id based on username
    const username = localStorage.getItem('username');
    if (username) {
      axios.get('http://localhost:3008/api/get-user-id', {
        params: { username }
      })
      .then(response => {
        setUserId(response.data.user_id);
      })
      .catch(error => {
        console.error('Error fetching user_id:', error);
      });
    }
  }, []);

  const handleFlavourSelect = async (flavour) => {
    const newSelectedFlavour = `${flavour.flavour} ${formData.selectedCategory}`;
    try {
      const response = await axios.get('http://localhost:3008/api/price', {
        params: {
          flavour: flavour.flavour,
          category: formData.selectedCategory
        }
      });
      const { Price, product_id } = response.data; // Destructure product_id from response
      const newPrice = Price;
      const newAmount = newPrice * (formData.quantity || 0);
  
      setFormData(prevData => ({
        ...prevData,
        selectedFlavour: newSelectedFlavour,
        price: newPrice,
        amount: newAmount,
        product_id: product_id // Store product_id
      }));
    } catch (error) {
      console.error("There was an error fetching the price!", error);
    }
  };
  
  

  const handleQuantityChange = (e) => {
    const newQuantity = parseFloat(e.target.value);
    if (newQuantity > 0) {
      const newAmount = (formData.price || 0) * newQuantity;
      setFormData(prevData => ({
        ...prevData,
        quantity: newQuantity,
        amount: newAmount,
      }));
    }
  };
  

  const handleAddItem = () => {
    setFormData(prevData => ({
      ...prevData,
      items: [...prevData.items, {
        selectedFlavour: prevData.selectedFlavour,
        price: prevData.price,
        quantity: prevData.quantity,
        amount: prevData.amount,
        product_id: prevData.product_id // Include product_id
      }],
      selectedFlavour: '',
      price: '',
      quantity: '',
      amount: '',
      product_id: '' // Reset product_id
    }));
  };
  
  

  const handleDeleteItem = (index) => {
    setFormData(prevData => {
      const newItems = prevData.items.filter((_, i) => i !== index);
      return {
        ...prevData,
        items: newItems,
      };
    });
    if (editIndex === index) {
      setEditIndex(null);
      setEditQuantity('');
      setEditAmount('');
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditQuantity(formData.items[index].quantity);
    setEditAmount(formData.items[index].amount);
  };

  const handleEditQuantityChange = (e) => {
  const newQuantity = parseFloat(e.target.value);
  if (newQuantity > 0) {
    const itemPrice = formData.items[editIndex].price; 
    const newAmount = itemPrice * newQuantity;
    setEditQuantity(newQuantity);
    setEditAmount(newAmount);
  }
};


  const handleSaveEdit = () => {
    setFormData(prevData => {
      const updatedItems = [...prevData.items];
      updatedItems[editIndex] = {
        ...updatedItems[editIndex],
        quantity: editQuantity,
        amount: editAmount,
      };
      return {
        ...prevData,
        items: updatedItems,
      };
    });
    
    setEditIndex(null);
    setEditQuantity('');
    setEditAmount('');
  };



  const handleGenerateInvoice = async () => {
    const totalAmount = formData.items.reduce((acc, item) => acc + item.amount, 0);
    const todayDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
    const invoiceData = {
      date: todayDate,
      invoiceNumber: formData.invoiceNumber,
      customerName: formData.customerName,
      customerContact: formData.customerContact,
      customerAddress: formData.customerAddress,
      items: formData.items,
      totalAmount,
    };
  
    try {
      // Update stock quantities
      await Promise.all(formData.items.map(async (item) => {
        if (!item.product_id) {
          throw new Error(`Product ID is missing for ${item.selectedFlavour}`);
        }
        console.log('Checking stock for product_id:', item.product_id);
        const response = await axios.get(`http://localhost:3008/api/check-quantity/${item.product_id}`);
        console.log('Stock response:', response.data);
        const currentQuantity = response.data.quantity;
        const quantitySold = item.quantity;
  
        if (quantitySold > currentQuantity) {
          throw new Error(`Not enough stock for ${item.selectedFlavour}`);
        }
  
        await axios.post('http://localhost:3008/api/update-quantity', {
          ProductID: item.product_id,
          quantitySold
        });
        console.log(`Stock updated for product_id ${item.product_id}. Quantity sold: ${quantitySold}`);
      }));
  
      // Add customer to the database
      const customerResponse = await axios.post('http://localhost:3008/api/add-customer', {
        name: formData.customerName,
        contact: formData.customerContact,
        address: formData.customerAddress,
        date: todayDate
      });
  
      // Extract customer_id from the response
      const customerId = customerResponse.data.customer_id;
      console.log('Customer ID:', customerId);
      console.log('User ID:', userId);
      // Add sale to the database
      console.log('Sending sale request with:', {
        customer_id: customerId,
        user_id: userId,
        total_cost: totalAmount
      });
  
      const saleResponse = await axios.post('http://localhost:3008/api/add-sale', {
        customer_id: customerId,
        user_id: userId,
        total_cost: totalAmount
      });
  
      console.log('Sale added with sales_id:', saleResponse.data.sales_id);
  
      // Generate the invoice
      console.log('Generating invoice with data:', invoiceData);
      Invoice.generate(invoiceData);
      setFormData(prevData => ({
        ...initialState,
        invoiceNumber: prevData.invoiceNumber + 1,
      }));
    } catch (error) {
      console.error('Error generating invoice:', error.response ? error.response.data : error.message);
      alert(`Failed to generate invoice. Error: ${error.message}`);
    }
  };
  
  

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return (
    
    <div className="App">
      {showPreview ? (
        <InvoicePreview
          customerName={formData.customerName}
          customerContact={formData.customerContact}
          customerAddress={formData.customerAddress}
          items={formData.items}
          totalAmount={formData.items.reduce((acc, item) => acc + item.amount, 0)}
          invoiceNumber={formData.invoiceNumber}
          date={new Date().toLocaleDateString()}
          onClose={handleClosePreview}
        />
      ) : (
        <>
          <div className="customer">
            <img src={img1} alt="ICE CREAM" width="390px" height="350px"/>
            <div className="customer-details">
              <h2>Customer Details</h2>
              <label>
                <b>Customer Name:</b>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Name"
                />
              </label>
              <br />
              <label>
                <b>Mobile Number:</b>
                <input
                 type="number"
                 value={formData.customerContact}
                 onChange={(e) => {
                 const value = parseFloat(e.target.value);
                 if (value > 0) {
                   setFormData({ ...formData, customerContact: value });
                 }
                 }}
                 placeholder="Mob No."
                 min="1"  // Ensure input accepts only positive numbers
                 />

              </label>
              <br />
              <label>
                <b>Address:</b>
                <textarea
                  value={formData.customerAddress}
                  onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                  placeholder="Address"
                ></textarea>
              </label>
              <br />
            </div>
          </div>
          {/* <p>User ID: {userId}</p> */}

          <div className="products">
            <div className="products_selection">
              <label>
                Category: <br />
                <select
                  value={formData.selectedCategory}
                  onChange={(e) => setFormData({ ...formData, selectedCategory: e.target.value })}
                  placeholder="Ice-Cream Category"
                > 
                  <option value="">Select Category</option>
                  {productTypes.map((type, index) => (
                    <option key={index} value={type.product_type}>{type.product_type}</option>
                  ))}
                </select>
              </label>
              <br />
              <label>Search</label><br/>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Flavours"
              />
              <br />
              <FlavoursTable
                onSelectFlavour={handleFlavourSelect}
                searchTerm={searchTerm} // Pass the search term as a prop
                selectedCategory={formData.selectedCategory} // Pass the selected category as a prop
              />
            </div>

            <div className="products_bill">
              <div className='products_bill_1'>
                <div className="billing-row">
                  <label>
                    Product Name:
                    <input type="text" value={formData.selectedFlavour} placeholder="Name" readOnly />
                  </label>
                  <label>
                    Price:
                    <input type="number" value={formData.price} placeholder="Price" readOnly />
                  </label>
                </div>
                <div className="billing-row">
                  <label>
                    Quantity:
                    <input
                    type="number"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    placeholder="Quantity"
                    min="1"  // Ensure input accepts only positive numbers
                    />

                  </label>
                  <label>
                    Amount:
                    <input type="number" value={formData.amount} placeholder="Amount" readOnly />
                  </label>
                </div>
                <button onClick={handleAddItem}>Add</button>
              </div>

              <div className="items-table">
                <h2>Added Items</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.selectedFlavour}</td>
                        <td>{item.price}</td>
                        <td>
                          {editIndex === index ? (
                            <input
                              type="number"
                              value={editQuantity}
                              onChange={handleEditQuantityChange}
                            />
                          ) : (
                            item.quantity
                          )}
                        </td>
                        <td>
                          {editIndex === index ? editAmount : item.amount}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <>
                              <button onClick={handleSaveEdit}>Save</button>
                              <button onClick={() => handleDeleteItem(index)}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditClick(index)}>Edit</button>
                              <button onClick={() => handleDeleteItem(index)}>Delete</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="totalamount">
                <h2>Total Amount: ₹{formData.items.reduce((acc, item) => acc + item.amount, 0)}</h2>
                </div>
              </div>

              
<div className="buttonshow">
    <button onClick={handleGenerateInvoice}>Generate Invoice</button>
    <button onClick={handleShowPreview}>Preview Invoice</button>
    <Link to="/dashboard">
      <button id="homeee">🏠</button>
    </Link>
</div>


            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
