import React, { useState, useEffect } from 'react';
import './OrderManagement.css';
import { FaEye, FaEdit, FaSearch, FaFilter } from 'react-icons/fa';
import { MdDeliveryDining, MdPending, MdCancel, MdCheckCircle } from 'react-icons/md';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [currentPage, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: 20,
                ...(statusFilter && { status: statusFilter })
            });

            const response = await fetch(`http://localhost:4000/allorders?${params}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            
            if (data.success) {
                setOrders(data.orders || []);
                setPagination(data.pagination || {});
                setError('');
            } else {
                setError(data.message || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrderDetails = async (orderId) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:4000/order/${orderId}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            
            if (data.success) {
                setSelectedOrder(data.order);
                setShowOrderDetails(true);
            } else {
                setError(data.message || 'Failed to fetch order details');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus, trackingNumber = '') => {
        try {
            setUpdatingStatus(true);
            const response = await fetch('http://localhost:4000/updateorderstatus', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    status: newStatus,
                    ...(trackingNumber && { trackingNumber })
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                // Update the order in the list
                setOrders(orders.map(order => 
                    order.orderId === orderId 
                        ? { ...order, status: newStatus, ...(trackingNumber && { trackingNumber }) }
                        : order
                ));
                
                // Update selected order if it's the same
                if (selectedOrder && selectedOrder.orderId === orderId) {
                    setSelectedOrder(prev => ({ 
                        ...prev, 
                        status: newStatus, 
                        ...(trackingNumber && { trackingNumber }) 
                    }));
                }
                
                alert('Order status updated successfully!');
            } else {
                alert(data.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Network error. Please try again.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <MdPending className="status-icon pending" />,
            confirmed: <MdCheckCircle className="status-icon confirmed" />,
            processing: <MdDeliveryDining className="status-icon processing" />,
            shipped: <MdDeliveryDining className="status-icon shipped" />,
            delivered: <MdCheckCircle className="status-icon delivered" />,
            cancelled: <MdCancel className="status-icon cancelled" />
        };
        return icons[status] || <MdPending className="status-icon" />;
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#ffa726',
            confirmed: '#42a5f5',
            processing: '#ab47bc',
            shipped: '#26a69a',
            delivered: '#66bb6a',
            cancelled: '#ef5350'
        };
        return colors[status] || '#757575';
    };

    const filteredOrders = orders.filter(order =>
        order.formattedOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (showOrderDetails && selectedOrder) {
        return (
            <div className="order-management">
                <div className="order-details-admin">
                    <div className="details-header">
                        <button 
                            className="back-btn" 
                            onClick={() => setShowOrderDetails(false)}
                        >
                            ← Back to Orders
                        </button>
                        <h2>Order Details - {selectedOrder.formattedOrderId}</h2>
                    </div>
                    
                    <div className="order-info-grid">
                        <div className="info-section">
                            <h3>Order Information</h3>
                            <p><strong>Order ID:</strong> {selectedOrder.formattedOrderId}</p>
                            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            <p><strong>Status:</strong> 
                                <span 
                                    className="status-badge" 
                                    style={{backgroundColor: getStatusColor(selectedOrder.status)}}
                                >
                                    {getStatusIcon(selectedOrder.status)}
                                    {selectedOrder.status.toUpperCase()}
                                </span>
                            </p>
                            <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus.toUpperCase()}</p>
                            <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                            {selectedOrder.trackingNumber && (
                                <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>
                            )}
                            {selectedOrder.estimatedDelivery && (
                                <p><strong>Estimated Delivery:</strong> {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</p>
                            )}
                        </div>

                        <div className="info-section">
                            <h3>Customer Information</h3>
                            <div className="customer-info">
                                <p><strong>Name:</strong> {selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}</p>
                                <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                                <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                                <div className="address">
                                    <strong>Shipping Address:</strong>
                                    <p>{selectedOrder.customerInfo.address}</p>
                                    <p>{selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.state} {selectedOrder.customerInfo.zipCode}</p>
                                </div>
                            </div>
                        </div>

                        <div className="info-section status-update-section">
                            <h3>Update Order Status</h3>
                            <div className="status-update-form">
                                <select 
                                    value={selectedOrder.status}
                                    onChange={(e) => {
                                        const newStatus = e.target.value;
                                        let trackingNumber = '';
                                        
                                        if (newStatus === 'shipped' && !selectedOrder.trackingNumber) {
                                            trackingNumber = prompt('Enter tracking number (optional):') || '';
                                        }
                                        
                                        if (window.confirm(`Update order status to "${newStatus}"?`)) {
                                            handleUpdateOrderStatus(selectedOrder.orderId, newStatus, trackingNumber);
                                        }
                                    }}
                                    disabled={updatingStatus}
                                    className="status-select"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                {updatingStatus && <div className="updating-status">Updating...</div>}
                            </div>
                        </div>
                    </div>

                    <div className="order-items-section">
                        <h3>Order Items ({selectedOrder.items.length})</h3>
                        <div className="order-items-grid">
                            {selectedOrder.items.map((item, index) => (
                                <div key={index} className="order-item-card">
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p>Price: ${item.price.toFixed(2)}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p><strong>Subtotal: ${item.subtotal.toFixed(2)}</strong></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-summary-section">
                        <h3>Order Summary</h3>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>${selectedOrder.orderSummary.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span>${selectedOrder.orderSummary.shipping.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax:</span>
                                <span>${selectedOrder.orderSummary.tax.toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span><strong>Total:</strong></span>
                                <span><strong>${selectedOrder.orderSummary.total.toFixed(2)}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-management">
            <div className="order-management-header">
                <h2>Order Management</h2>
                <div className="order-stats">
                    <div className="stat-card">
                        <span className="stat-number">{pagination.totalOrders || 0}</span>
                        <span className="stat-label">Total Orders</span>
                    </div>
                </div>
            </div>

            <div className="order-filters">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by order ID, customer name, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="status-filter">
                    <FaFilter className="filter-icon" />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading && orders.length === 0 ? (
                <div className="loading">Loading orders...</div>
            ) : error ? (
                <div className="error">
                    <p>{error}</p>
                    <button onClick={fetchOrders}>Retry</button>
                </div>
            ) : (
                <div className="orders-table-container">
                    {filteredOrders.length === 0 ? (
                        <div className="no-orders">
                            <p>No orders found matching your criteria.</p>
                        </div>
                    ) : (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Payment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>
                                            <div className="order-id-cell">
                                                {order.formattedOrderId}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="customer-cell">
                                                <strong>{order.customerInfo.firstName} {order.customerInfo.lastName}</strong>
                                                <small>{order.customerInfo.email}</small>
                                            </div>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{order.items.length}</td>
                                        <td>${order.orderSummary.total.toFixed(2)}</td>
                                        <td>
                                            <span 
                                                className="status-badge table-status" 
                                                style={{backgroundColor: getStatusColor(order.status)}}
                                            >
                                                {getStatusIcon(order.status)}
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`payment-status ${order.paymentStatus}`}>
                                                {order.paymentStatus.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="view-btn"
                                                    onClick={() => handleViewOrderDetails(order.orderId)}
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => {
                                                        const newStatus = prompt(
                                                            `Current status: ${order.status}\nEnter new status (pending/confirmed/processing/shipped/delivered/cancelled):`
                                                        );
                                                        
                                                        if (newStatus && ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus.toLowerCase())) {
                                                            let trackingNumber = '';
                                                            if (newStatus.toLowerCase() === 'shipped' && !order.trackingNumber) {
                                                                trackingNumber = prompt('Enter tracking number (optional):') || '';
                                                            }
                                                            handleUpdateOrderStatus(order.orderId, newStatus.toLowerCase(), trackingNumber);
                                                        } else if (newStatus) {
                                                            alert('Invalid status. Please enter: pending, confirmed, processing, shipped, delivered, or cancelled');
                                                        }
                                                    }}
                                                    title="Update Status"
                                                    disabled={updatingStatus}
                                                >
                                                    <FaEdit />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={!pagination.hasPrevPage || loading}
                                className="pagination-btn"
                            >
                                Previous
                            </button>
                            
                            <span className="pagination-info">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            
                            <button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={!pagination.hasNextPage || loading}
                                className="pagination-btn"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
