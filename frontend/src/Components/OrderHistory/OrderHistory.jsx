import React, { useState, useEffect, useContext } from 'react';
import { FurnitureContext } from '../../Context/FurnitureContext';
import './OrderHistory.css';

const OrderHistory = () => {
    const { getUserOrders, getOrderDetails } = useContext(FurnitureContext);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const result = await getUserOrders();
            
            if (result.success) {
                setOrders(result.orders || []);
            } else {
                setError(result.message || 'Failed to fetch orders');
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
            const result = await getOrderDetails(orderId);
            
            if (result.success) {
                setSelectedOrder(result.order);
                setShowOrderDetails(true);
            } else {
                setError(result.message || 'Failed to fetch order details');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
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

    if (loading && orders.length === 0) {
        return (
            <div className="order-history">
                <div className="loading">
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-history">
                <div className="error">
                    <p>{error}</p>
                    <button onClick={fetchOrders}>Try Again</button>
                </div>
            </div>
        );
    }

    if (showOrderDetails && selectedOrder) {
        return (
            <div className="order-history">
                <div className="order-details">
                    <div className="details-header">
                        <button 
                            className="back-btn" 
                            onClick={() => setShowOrderDetails(false)}
                        >
                            ← Back to Orders
                        </button>
                        <h2>Order Details</h2>
                    </div>
                    
                    <div className="order-info">
                        <div className="info-section">
                            <h3>Order Information</h3>
                            <p><strong>Order ID:</strong> {selectedOrder.formattedOrderId}</p>
                            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> 
                                <span 
                                    className="status-badge" 
                                    style={{backgroundColor: getStatusColor(selectedOrder.status)}}
                                >
                                    {selectedOrder.status.toUpperCase()}
                                </span>
                            </p>
                            <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus.toUpperCase()}</p>
                            {selectedOrder.trackingNumber && (
                                <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>
                            )}
                            {selectedOrder.estimatedDelivery && (
                                <p><strong>Estimated Delivery:</strong> {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</p>
                            )}
                        </div>

                        <div className="info-section">
                            <h3>Shipping Address</h3>
                            <div className="address">
                                <p>{selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}</p>
                                <p>{selectedOrder.customerInfo.address}</p>
                                <p>{selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.state} {selectedOrder.customerInfo.zipCode}</p>
                                <p>{selectedOrder.customerInfo.phone}</p>
                                <p>{selectedOrder.customerInfo.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="order-items">
                        <h3>Order Items</h3>
                        {selectedOrder.items.map((item, index) => (
                            <div key={index} className="order-item">
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

                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${selectedOrder.orderSummary.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span>${selectedOrder.orderSummary.shipping.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span><strong>Total:</strong></span>
                            <span><strong>${selectedOrder.orderSummary.total.toFixed(2)}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-history">
            <div className="orders-container">
                <h2>My Orders</h2>
                
                {orders.length === 0 ? (
                    <div className="no-orders">
                        <p>You haven't placed any orders yet.</p>
                        <button onClick={() => window.location.href = '/'}>
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div className="order-id">
                                        <h3>{order.formattedOrderId}</h3>
                                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="order-status">
                                        <span 
                                            className="status-badge" 
                                            style={{backgroundColor: getStatusColor(order.status)}}
                                        >
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="order-summary">
                                    <p><strong>Items:</strong> {order.items.length}</p>
                                    <p><strong>Total:</strong> ${order.orderSummary.total.toFixed(2)}</p>
                                    <p><strong>Payment:</strong> {order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                                </div>
                                
                                <div className="order-items-preview">
                                    {order.items.slice(0, 3).map((item, index) => (
                                        <img 
                                            key={index} 
                                            src={item.image} 
                                            alt={item.name}
                                            className="item-preview"
                                        />
                                    ))}
                                    {order.items.length > 3 && (
                                        <span className="more-items">+{order.items.length - 3} more</span>
                                    )}
                                </div>
                                
                                <button 
                                    className="view-details-btn"
                                    onClick={() => handleViewOrderDetails(order.orderId)}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
