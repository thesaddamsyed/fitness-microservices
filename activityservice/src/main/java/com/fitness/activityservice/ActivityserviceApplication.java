package com.fitness.activityservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ActivityserviceApplication {

	public static void main(String[] args) {
		// Starting point of the Activity Service application
		// code to print beep sound
		System.out.print("\007"); // ASCII bell character
		System.out.flush();

		SpringApplication.run(ActivityserviceApplication.class, args);
	}

}
