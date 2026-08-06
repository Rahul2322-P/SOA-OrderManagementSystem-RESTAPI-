package com.klef.soa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klef.soa.entity.Order;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long>
{
    List<Order> findByName(String name);

    List<Order> findByType(String type);
}