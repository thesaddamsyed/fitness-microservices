package com.fitness.aiservice.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.fitness.aiservice.model.Activity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityMessageListener {

    @RabbitListener(queues = "fitness.queue")
    public void processActivity(Activity activity) {
        log.info("recieved activity for processing: {}", activity.getId());
    }
}
