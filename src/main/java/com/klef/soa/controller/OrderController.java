package com.klef.soa.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.CrossOrigin;

import com.klef.soa.entity.Order;
import com.klef.soa.service.OrderService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/order")
public class OrderController
{
    @Autowired
    private OrderService service;

    @GetMapping("/")
    public String demo()
    {
        return "Spring Boot Project";
    }

    @PostMapping("/add")
    public ResponseEntity<Order> addOrder(@RequestBody Order order)
    {
        Order o = service.insertOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(o);
    }

    @GetMapping("/displayall")
    public ResponseEntity<List<Order>> displayAllOrders()
    {
        List<Order> orders = service.displayAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/display")
    public ResponseEntity<?> displayOrderById(@RequestParam Long id)
    {
        Order order = service.displayOrderById(id);

        if(order != null)
        {
            return ResponseEntity.ok(order);
        }
        else
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order ID Not Found");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateOrder(@RequestBody Order order)
    {
        Order o = service.updateOrder(order.getOrderId(), order);

        if(o != null)
        {
            return ResponseEntity.ok(o);
        }
        else
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order ID Not Found");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteOrderById(@PathVariable Long id)
    {
        String message = service.deleteOrder(id);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @GetMapping("/displaybyname/{name}")
    public ResponseEntity<List<Order>> displayOrdersByName(@PathVariable String name)
    {
        List<Order> orders = service.findByName(name);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/displaybytype/{type}")
    public ResponseEntity<List<Order>> displayOrdersByType(@PathVariable String type)
    {
        List<Order> orders = service.findByType(type);
        return ResponseEntity.ok(orders);
    }
}