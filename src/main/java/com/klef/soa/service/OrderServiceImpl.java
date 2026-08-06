package com.klef.soa.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.entity.Order;
import com.klef.soa.repository.OrderRepo;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Override
    public Order insertOrder(Order order) {
        return orderRepo.save(order);
    }

    @Override
    public Order updateOrder(Long orderId, Order order) {

        Optional<Order> optional = orderRepo.findById(orderId);

        if (optional.isPresent()) {

            Order existingOrder = optional.get();

            existingOrder.setName(order.getName());
            existingOrder.setType(order.getType());
            existingOrder.setStatus(order.getStatus());
            existingOrder.setLocation(order.getLocation());

            return orderRepo.save(existingOrder);
        }

        return null;
    }

    public String deleteOrder(Long orderId) {

        Optional<Order> optional = orderRepo.findById(orderId);

        if (optional.isPresent()) {
            orderRepo.deleteById(orderId);
            return "Order Deleted Successfully";
        }

        return "Order ID Not Found";
    }

    public List<Order> displayAllOrders() {
        return orderRepo.findAll();
    }

    public Order displayOrderById(Long orderId) {

        Optional<Order> optional = orderRepo.findById(orderId);

        if (optional.isPresent()) {
            return optional.get();
        }

        return null;
    }

    @Override
    public List<Order> findByName(String name) {
        return orderRepo.findByName(name);
    }

    @Override
    public List<Order> findByType(String type) {
        return orderRepo.findByType(type);
    }

}