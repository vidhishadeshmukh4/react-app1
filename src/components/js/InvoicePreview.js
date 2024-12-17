import React from 'react';
import '../css/InvoicePreview.css';

const InvoicePreview = ({ customerName, customerContact, customerAddress, items, totalAmount, invoiceNumber, date, onClose }) => {
    return (
        <div className="invoice-preview-container">
            <div className="invoice-preview-header">
                <button onClick={onClose}>Close Preview</button>
            </div>
            <div className="invoice-preview">
                <div className="invoice-header">
                    <img src={require('../images/logo.png')} alt="Whipp n Dipp" className="invoice-logo" />
                    <div className="invoice-details">
                        <p>Date: {date}</p>
                        <p>Invoice #: {invoiceNumber}</p>
                    </div>
                </div>
                <div className="invoice-content">
                    <div className="company-info">
                        <div>
                            <h3>Whipp n Dipp</h3>
                            <p>Contact Number: 123-456-7890</p>
                            <p>Address: 123 Ice Cream St., Sweet City, SC</p>
                        </div>
                        <div className="customer-info">
                            <h3>Customer Information</h3>
                            <p>Name: {customerName}</p>
                            <p>Contact: {customerContact}</p>
                            <p>Address: {customerAddress}</p>
                        </div>
                    </div>
                    <div className="invoice-items">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product details</th>
                                    <th>Price</th>
                                    <th>Qty.</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.selectedFlavour}</td>
                                        <td>₹{Number(item.price).toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>₹{Number(item.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="invoice-total">
                        <h3>Total: ₹{Number(totalAmount).toFixed(2)}</h3>
                    </div>
                    <div className="thank-you">
                        <p>Thank you for ordering. Visit us again!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;
