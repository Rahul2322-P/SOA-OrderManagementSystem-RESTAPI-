import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import ConfirmModal from './components/ConfirmModal';
import OrderDetailsModal from './components/OrderDetailsModal';
import OrderFormModal from './components/OrderFormModal';
import Dashboard from './pages/Dashboard';
import OrdersList from './pages/OrdersList';
import ApiDocsView from './pages/ApiDocsView';
import orderService from './api/orderService';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Notifications
  const [notification, setNotification] = useState(null);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formInitialData, setFormInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [detailsOrder, setDetailsOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch orders from Spring Boot REST API
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      setNotification({
        type: 'error',
        title: 'Failed to fetch orders',
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Form open handlers
  const handleOpenCreate = () => {
    setFormInitialData(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (order) => {
    setFormInitialData(order);
    setIsFormOpen(true);
  };

  // Form submission: Create or Update
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (formData.orderId) {
        // Update
        const updated = await orderService.updateOrder(formData);
        setNotification({
          type: 'success',
          title: 'Order Updated',
          message: `Order #${updated.orderId} "${updated.name}" has been updated.`,
        });
      } else {
        // Create
        const created = await orderService.createOrder(formData);
        setNotification({
          type: 'success',
          title: 'Order Created',
          message: `Order #${created.orderId} "${created.name}" created successfully.`,
        });
      }
      setIsFormOpen(false);
      setFormInitialData(null);
      await fetchOrders();
    } catch (err) {
      setNotification({
        type: 'error',
        title: 'Operation Failed',
        message: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // View details
  const handleViewOrder = (order) => {
    setDetailsOrder(order);
    setIsDetailsOpen(true);
  };

  // Delete handlers
  const handleDeleteRequest = (order) => {
    setDeleteCandidate(order);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      setIsDeleting(true);
      const resMsg = await orderService.deleteOrder(deleteCandidate.orderId);
      setNotification({
        type: 'success',
        title: 'Order Deleted',
        message: resMsg || `Order #${deleteCandidate.orderId} was removed.`,
      });
      setDeleteCandidate(null);
      await fetchOrders();
    } catch (err) {
      setNotification({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
        {/* Navigation Bar */}
        <Navbar
          onOpenCreateModal={handleOpenCreate}
          totalOrdersCount={orders.length}
          onRefreshData={fetchOrders}
        />

        {/* Global Toast Notification */}
        <Notification
          notification={notification}
          onDismiss={() => setNotification(null)}
        />

        {/* Main Content View */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  orders={orders}
                  isLoading={isLoading}
                  error={error}
                  onRefresh={fetchOrders}
                  onOpenCreate={handleOpenCreate}
                  onViewOrder={handleViewOrder}
                  onEditOrder={handleOpenEdit}
                  onDeleteOrder={handleDeleteRequest}
                />
              }
            />
            <Route
              path="/orders"
              element={
                <OrdersList
                  orders={orders}
                  isLoading={isLoading}
                  onRefresh={fetchOrders}
                  onOpenCreate={handleOpenCreate}
                  onViewOrder={handleViewOrder}
                  onEditOrder={handleOpenEdit}
                  onDeleteOrder={handleDeleteRequest}
                />
              }
            />
            <Route path="/api-docs" element={<ApiDocsView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <strong className="text-slate-800 font-semibold">Order Management System</strong> · SOA REST API Project
            </div>
            <div className="flex items-center gap-4">
              <span>Developer: Rahul (GitHub: Rahul2322-P)</span>
              <span>•</span>
              <a
                href="https://github.com/Rahul2322-P/SOA-OrderManagementSystem-RESTAPI-"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline font-medium"
              >
                GitHub Repository
              </a>
            </div>
          </div>
        </footer>

        {/* Order Form Modal (Create & Edit) */}
        <OrderFormModal
          isOpen={isFormOpen}
          initialData={formInitialData}
          onClose={() => {
            setIsFormOpen(false);
            setFormInitialData(null);
          }}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />

        {/* Order Details Modal */}
        <OrderDetailsModal
          isOpen={isDetailsOpen}
          order={detailsOrder}
          onClose={() => {
            setIsDetailsOpen(false);
            setDetailsOrder(null);
          }}
          onEdit={(order) => {
            setIsDetailsOpen(false);
            handleOpenEdit(order);
          }}
          onDelete={(order) => {
            setIsDetailsOpen(false);
            handleDeleteRequest(order);
          }}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(deleteCandidate)}
          title="Delete Order Record"
          message={`Are you sure you want to delete order #${deleteCandidate?.orderId}? This will remove the record permanently from the database.`}
          itemDetails={deleteCandidate}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteCandidate(null)}
        />
      </div>
    </BrowserRouter>
  );
}
