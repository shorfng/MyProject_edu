package com.loto.edu.front;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableDiscoveryClient
@SpringBootApplication
@EnableFeignClients("com.loto.edu")
public class EduFrontApplication implements WebMvcConfigurer {
    public static void main(String[] args) {
        SpringApplication.run(EduFrontApplication.class, args);
    }
}
