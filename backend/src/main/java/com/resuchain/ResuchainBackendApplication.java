package com.resuchain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ResuchainBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResuchainBackendApplication.class, args);
    }

}
