import React, { useState, useEffect } from 'react';
import './OrderManagement.css';
import { FaEye, FaSearch, FaFilter } from 'react-icons/fa';
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
    const [openStatusDropdown, setOpenStatusDropdown] = useState(null);
    const [modal, setModal] = useState({
        visible: false,
        title: '',
        message: '',
        orderId: null,
        newStatus: '',
        requireTracking: false,
        trackingValue: '',
        trackingError: '',
        requirePaymentConfirm: false,
        paymentConfirmed: null,
        paymentError: ''
    });
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    

    const showToast = (message, type = 'success', duration = 3000) => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), duration);
    };

    const getAuthHeaders = () => {
        let token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('adminToken');
        if (!token) {
            const userStr = localStorage.getItem('user') || localStorage.getItem('userInfo');
            if (userStr) {
                try {
                    const parsed = JSON.parse(userStr);
                    token = parsed?.token || parsed?.accessToken || parsed?.authToken;
                } catch (e) {
                    // ignore
                }
            }
        }
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const hasAuthToken = () => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('adminToken');
        if (token) return true;
        const userStr = localStorage.getItem('user') || localStorage.getItem('userInfo');
        if (!userStr) return false;
        try { const parsed = JSON.parse(userStr); return Boolean(parsed?.token || parsed?.accessToken || parsed?.authToken); } catch (e) { return false; }
    };

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
                    ...getAuthHeaders()
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
        // If no auth token available, show details from already-loaded orders array
        if (!hasAuthToken()) {
            const local = orders.find(o => o.orderId === orderId || o._id === orderId);
            if (local) {
                setSelectedOrder(local);
                setShowOrderDetails(true);
                return;
            }

            // If not present locally, inform user that details require authentication
            showToast('Order details unavailable locally. Please authenticate to fetch details.', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:4000/order/${orderId}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
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

    const handleUpdateOrderStatus = async (orderId, newStatus, trackingNumber = '', paymentConfirmed) => {
        try {
            setUpdatingStatus(true);
            const auth = getAuthHeaders();

            const response = await fetch('http://localhost:4000/updateorderstatus', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...auth
                },
                body: JSON.stringify({
                    orderId,
                    status: newStatus,
                    ...(trackingNumber && { trackingNumber }),
                    ...(typeof paymentConfirmed !== 'undefined' && { paymentConfirmed })
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Determine paymentStatus update if provided
                const newPaymentStatus = typeof paymentConfirmed !== 'undefined'
                    ? (paymentConfirmed ? 'completed' : 'pending')
                    : undefined;

                // Update the order in the list
                setOrders(orders.map(o => 
                    o.orderId === orderId 
                        ? { ...o, status: newStatus, ...(trackingNumber && { trackingNumber }), ...(typeof newPaymentStatus !== 'undefined' && { paymentStatus: newPaymentStatus }) }
                        : o
                ));
                
                // Update selected order if it's the same
                if (selectedOrder && selectedOrder.orderId === orderId) {
                    setSelectedOrder(prev => ({ 
                        ...prev, 
                        status: newStatus, 
                        ...(trackingNumber && { trackingNumber }),
                        ...(typeof newPaymentStatus !== 'undefined' && { paymentStatus: newPaymentStatus })
                    }));
                }
                
                showToast('Order status updated successfully!', 'success');
            } else {
                showToast(data.message || 'Failed to update order status', 'error');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            showToast('Network error. Please try again.', 'error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const openConfirmModal = ({ title, message, orderId, newStatus, requireTracking = false, requirePaymentConfirm = false }) => {
        setModal({
            visible: true,
            title,
            message,
            orderId,
            newStatus: newStatus && newStatus.toLowerCase(),
            requireTracking,
            trackingValue: '',
            trackingError: '',
            requirePaymentConfirm,
            paymentConfirmed: null,
            paymentError: ''
        });
    };

    const closeModal = () => setModal(prev => ({ ...prev, visible: false }));

    const confirmModal = async () => {
        if (modal.requireTracking && (!modal.trackingValue || !modal.trackingValue.trim())) {
            setModal(prev => ({ ...prev, trackingError: 'Please enter a tracking number.' }));
            return;
        }

        if (modal.requirePaymentConfirm && modal.paymentConfirmed === null) {
            setModal(prev => ({ ...prev, paymentError: 'Please confirm payment status.' }));
            return;
        }

        const tracking = modal.requireTracking ? modal.trackingValue.trim() : '';
        const paymentConfirmed = modal.requirePaymentConfirm ? modal.paymentConfirmed : undefined;
        await handleUpdateOrderStatus(modal.orderId, modal.newStatus, tracking, paymentConfirmed);
        closeModal();
        setOpenStatusDropdown(null);
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
                                        const requireTracking = newStatus === 'shipped';
                                        const requirePaymentConfirm = newStatus === 'delivered';
                                        openConfirmModal({
                                            title: 'Update Order Status',
                                            message: `Update order status to "${newStatus}"?`,
                                            orderId: selectedOrder.orderId,
                                            newStatus,
                                            requireTracking,
                                            requirePaymentConfirm
                                        });
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

                {modal.visible && (
                    <div className="popup-overlay" onClick={closeModal}>
                        <div className="popup-message" onClick={(e) => e.stopPropagation()}>
                            <h4>{modal.title}</h4>
                            <p>{modal.message}</p>
                            {modal.requireTracking && (
                                <div>
                                    <input
                                        type="text"
                                        value={modal.trackingValue}
                                        onChange={(e) => setModal(prev => ({ ...prev, trackingValue: e.target.value, trackingError: '' }))}
                                        placeholder="Enter tracking number"
                                        style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        autoFocus
                                    />
                                    {modal.trackingError && (
                                        <div className="tracking-error">{modal.trackingError}</div>
                                    )}
                                </div>
                            )}
                            {modal.requirePaymentConfirm && (
                                <div style={{ marginTop: '8px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Was payment successful?</label>
                                    <div className="payment-choices">
                                        <label style={{ marginRight: '12px' }}>
                                            <input
                                                type="radio"
                                                name="paymentConfirm"
                                                checked={modal.paymentConfirmed === true}
                                                onChange={() => setModal(prev => ({ ...prev, paymentConfirmed: true, paymentError: '' }))}
                                            />
                                            {' '}Yes
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="paymentConfirm"
                                                checked={modal.paymentConfirmed === false}
                                                onChange={() => setModal(prev => ({ ...prev, paymentConfirmed: false, paymentError: '' }))}
                                            />
                                            {' '}No
                                        </label>
                                    </div>
                                    {modal.paymentError && (
                                        <div className="tracking-error">{modal.paymentError}</div>
                                    )}
                                </div>
                            )}
                            <div className="popup-actions">
                                <button className="popup-cancel" onClick={closeModal}>Cancel</button>
                                <button className="popup-confirm" onClick={confirmModal}>Confirm</button>
                            </div>
                        </div>
                    </div>
                )}

                {toast.visible && (
                    <div className={`toast ${toast.type}`} role="status">
                        {toast.message}
                    </div>
                )}
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
                                            {openStatusDropdown === order.orderId ? (
                                                <select
                                                    className="status-select-inline"
                                                    value={order.status}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value;
                                                        const requireTracking = newStatus === 'shipped';
                                                        const requirePaymentConfirm = newStatus === 'delivered';
                                                        openConfirmModal({
                                                            title: 'Update Order Status',
                                                            message: `Update order status to "${newStatus}"?`,
                                                            orderId: order.orderId,
                                                            newStatus,
                                                            requireTracking,
                                                            requirePaymentConfirm
                                                        });
                                                    }}
                                                    onBlur={() => setOpenStatusDropdown(null)}
                                                    autoFocus
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            ) : (
                                                <span 
                                                    className="status-badge table-status" 
                                                    style={{backgroundColor: getStatusColor(order.status), cursor: 'pointer'}}
                                                    onClick={(e) => { e.stopPropagation(); setOpenStatusDropdown(order.orderId); }}
                                                >
                                                    {getStatusIcon(order.status)}
                                                    {order.status.toUpperCase()}
                                                </span>
                                            )}
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {modal.visible && (
                        <div className="popup-overlay" onClick={closeModal}>
                            <div className="popup-message" onClick={(e) => e.stopPropagation()}>
                                <h4>{modal.title}</h4>
                                <p>{modal.message}</p>
                                {modal.requireTracking && (
                                    <div>
                                        <input
                                            type="text"
                                            value={modal.trackingValue}
                                            onChange={(e) => setModal(prev => ({ ...prev, trackingValue: e.target.value, trackingError: '' }))}
                                            placeholder="Enter tracking number"
                                            style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                                            autoFocus
                                        />
                                        {modal.trackingError && (
                                            <div className="tracking-error">{modal.trackingError}</div>
                                        )}
                                    </div>
                                )}
                                {modal.requirePaymentConfirm && (
                                    <div style={{ marginTop: '8px' }}>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Was payment successful?</label>
                                        <div className="payment-choices">
                                            <label style={{ marginRight: '12px' }}>
                                                <input
                                                    type="radio"
                                                    name="paymentConfirm"
                                                    checked={modal.paymentConfirmed === true}
                                                    onChange={() => setModal(prev => ({ ...prev, paymentConfirmed: true, paymentError: '' }))}
                                                />
                                                {' '}Yes
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="paymentConfirm"
                                                    checked={modal.paymentConfirmed === false}
                                                    onChange={() => setModal(prev => ({ ...prev, paymentConfirmed: false, paymentError: '' }))}
                                                />
                                                {' '}No
                                            </label>
                                        </div>
                                        {modal.paymentError && (
                                            <div className="tracking-error">{modal.paymentError}</div>
                                        )}
                                    </div>
                                )}
                                <div className="popup-actions">
                                    <button className="popup-cancel" onClick={closeModal}>Cancel</button>
                                    <button className="popup-confirm" onClick={confirmModal}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {toast.visible && (
                        <div className={`toast ${toast.type}`} role="status">
                            {toast.message}
                        </div>
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
