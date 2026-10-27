package com.klef.soa.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.klef.soa.entity.Order;
import com.klef.soa.repository.OrderRepo;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepo orderRepo;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        sampleOrder = new Order();
        sampleOrder.setOrderId(1L);
        sampleOrder.setName("Laptop");
        sampleOrder.setType("Electronics");
        sampleOrder.setStatus("Delivered");
        sampleOrder.setLocation("New York");
        sampleOrder.setCreatedAt(LocalDateTime.now());
        sampleOrder.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testInsertOrder() {
        when(orderRepo.save(any(Order.class))).thenReturn(sampleOrder);

        Order created = orderService.insertOrder(sampleOrder);

        assertNotNull(created);
        assertEquals(1L, created.getOrderId());
        assertEquals("Laptop", created.getName());
        verify(orderRepo, times(1)).save(sampleOrder);
    }

    @Test
    void testDisplayAllOrders() {
        when(orderRepo.findAll()).thenReturn(Arrays.asList(sampleOrder));

        List<Order> orders = orderService.displayAllOrders();

        assertNotNull(orders);
        assertEquals(1, orders.size());
        assertEquals("Laptop", orders.get(0).getName());
        verify(orderRepo, times(1)).findAll();
    }

    @Test
    void testDisplayOrderById_Found() {
        when(orderRepo.findById(1L)).thenReturn(Optional.of(sampleOrder));

        Order found = orderService.displayOrderById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getOrderId());
        verify(orderRepo, times(1)).findById(1L);
    }

    @Test
    void testDisplayOrderById_NotFound() {
        when(orderRepo.findById(99L)).thenReturn(Optional.empty());

        Order found = orderService.displayOrderById(99L);

        assertNull(found);
        verify(orderRepo, times(1)).findById(99L);
    }

    @Test
    void testUpdateOrder_Found() {
        Order updateData = new Order();
        updateData.setName("Gaming Laptop");
        updateData.setType("Electronics");
        updateData.setStatus("Processing");
        updateData.setLocation("San Francisco");

        when(orderRepo.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepo.save(any(Order.class))).thenReturn(sampleOrder);

        Order updated = orderService.updateOrder(1L, updateData);

        assertNotNull(updated);
        assertEquals("Gaming Laptop", sampleOrder.getName());
        assertEquals("Processing", sampleOrder.getStatus());
        verify(orderRepo, times(1)).save(sampleOrder);
    }

    @Test
    void testUpdateOrder_NotFound() {
        when(orderRepo.findById(99L)).thenReturn(Optional.empty());

        Order updated = orderService.updateOrder(99L, sampleOrder);

        assertNull(updated);
        verify(orderRepo, never()).save(any());
    }

    @Test
    void testDeleteOrder_Found() {
        when(orderRepo.findById(1L)).thenReturn(Optional.of(sampleOrder));
        doNothing().when(orderRepo).deleteById(1L);

        String result = orderService.deleteOrder(1L);

        assertEquals("Order Deleted Successfully", result);
        verify(orderRepo, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteOrder_NotFound() {
        when(orderRepo.findById(99L)).thenReturn(Optional.empty());

        String result = orderService.deleteOrder(99L);

        assertEquals("Order ID Not Found", result);
        verify(orderRepo, never()).deleteById(anyLong());
    }

    @Test
    void testFindByName() {
        when(orderRepo.findByName("Laptop")).thenReturn(Arrays.asList(sampleOrder));

        List<Order> orders = orderService.findByName("Laptop");

        assertNotNull(orders);
        assertEquals(1, orders.size());
        assertEquals("Laptop", orders.get(0).getName());
        verify(orderRepo, times(1)).findByName("Laptop");
    }

    @Test
    void testFindByType() {
        when(orderRepo.findByType("Electronics")).thenReturn(Arrays.asList(sampleOrder));

        List<Order> orders = orderService.findByType("Electronics");

        assertNotNull(orders);
        assertEquals(1, orders.size());
        assertEquals("Electronics", orders.get(0).getType());
        verify(orderRepo, times(1)).findByType("Electronics");
    }
}
