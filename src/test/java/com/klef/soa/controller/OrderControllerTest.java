package com.klef.soa.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.klef.soa.entity.Order;
import com.klef.soa.service.OrderService;

@ExtendWith(MockitoExtension.class)
public class OrderControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(orderController).build();
        objectMapper.findAndRegisterModules();

        sampleOrder = new Order();
        sampleOrder.setOrderId(1L);
        sampleOrder.setName("Smartphone");
        sampleOrder.setType("Electronics");
        sampleOrder.setStatus("Pending");
        sampleOrder.setLocation("Chicago");
    }

    @Test
    void testDemoEndpoint() throws Exception {
        mockMvc.perform(get("/order/"))
                .andExpect(status().isOk())
                .andExpect(content().string("Spring Boot Project"));
    }

    @Test
    void testAddOrder() throws Exception {
        when(orderService.insertOrder(any(Order.class))).thenReturn(sampleOrder);

        mockMvc.perform(post("/order/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleOrder)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.name").value("Smartphone"))
                .andExpect(jsonPath("$.status").value("Pending"));
    }

    @Test
    void testDisplayAllOrders() throws Exception {
        when(orderService.displayAllOrders()).thenReturn(Arrays.asList(sampleOrder));

        mockMvc.perform(get("/order/displayall"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orderId").value(1))
                .andExpect(jsonPath("$[0].name").value("Smartphone"));
    }

    @Test
    void testDisplayOrderById_Found() throws Exception {
        when(orderService.displayOrderById(1L)).thenReturn(sampleOrder);

        mockMvc.perform(get("/order/display").param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.name").value("Smartphone"));
    }

    @Test
    void testDisplayOrderById_NotFound() throws Exception {
        when(orderService.displayOrderById(99L)).thenReturn(null);

        mockMvc.perform(get("/order/display").param("id", "99"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Order ID Not Found"));
    }

    @Test
    void testUpdateOrder_Found() throws Exception {
        when(orderService.updateOrder(eq(1L), any(Order.class))).thenReturn(sampleOrder);

        mockMvc.perform(put("/order/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleOrder)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.name").value("Smartphone"));
    }

    @Test
    void testUpdateOrder_NotFound() throws Exception {
        when(orderService.updateOrder(eq(1L), any(Order.class))).thenReturn(null);

        mockMvc.perform(put("/order/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleOrder)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Order ID Not Found"));
    }

    @Test
    void testDeleteOrder() throws Exception {
        when(orderService.deleteOrder(1L)).thenReturn("Order Deleted Successfully");

        mockMvc.perform(delete("/order/delete/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Order Deleted Successfully"));
    }

    @Test
    void testDisplayOrdersByName() throws Exception {
        when(orderService.findByName("Smartphone")).thenReturn(Collections.singletonList(sampleOrder));

        mockMvc.perform(get("/order/displaybyname/Smartphone"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Smartphone"));
    }

    @Test
    void testDisplayOrdersByType() throws Exception {
        when(orderService.findByType("Electronics")).thenReturn(Collections.singletonList(sampleOrder));

        mockMvc.perform(get("/order/displaybytype/Electronics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("Electronics"));
    }
}
