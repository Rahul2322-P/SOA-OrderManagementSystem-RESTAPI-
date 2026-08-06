package com.klef.soa.service;

import java.util.List;

import com.klef.soa.entity.Order;

public interface OrderService
{
    public Order insertOrder(Order order);

    public Order updateOrder(Long orderId, Order order);

    public String deleteOrder(Long orderId);

    public List<Order> displayAllOrders();

    public Order displayOrderById(Long orderId);

    public List<Order> findByName(String name);

    public List<Order> findByType(String type);
}