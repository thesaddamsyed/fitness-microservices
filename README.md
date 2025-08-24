Fitness Microservices

## Overview

This repository contains a backend implementation of a fitness platform using a microservices architecture. The core services currently include:

- **User Service**: Handles user registration, authentication, and profile management.
- **Activity Service**: Records fitness activities and sends messages to the AI pipeline via RabbitMQ.
- **AI Service**: Listens to activity events and generates personalized recommendations using Gemini.AI.
- **ChatGPT Service**: Provides conversational capabilities and support, integrated with AI-generated insights.

Frontend development is pending—I’m focusing on the backend architecture for now. The plan is to add web and mobile clients soon, making this a full-stack fitness application.

---

## Why This Project Exists

The motivation is to build a scalable and decoupled system that separates concerns:

- **Activity tracking** is decoupled from **AI processing**, allowing the AI component to evolve independently.
- Asynchronous messaging with RabbitMQ ensures resilience and scalability under load.
- Integration with Gemini.AI enriches user experience with event-driven recommendation generation.

---

## Architecture

- Each service is a standalone Spring Boot application.
- Services discover each other via Spring Cloud Eureka.
- Messaging uses RabbitMQ with a dedicated exchange (`fitness.exchange`), binding (`activity.tracking`), and dedicated queue (`fitness.queue`).
- AI service consumes events, processes them using AI APIs, and updates recommendation outputs.
- Services are designed for horizontal scaling and future deployment in containerized environments.

---

## Technical Stack

- **Java 21**, Spring Boot, Spring Cloud (Eureka, Load Balanced REST/WebClient)
- **RabbitMQ** for messaging
- **MongoDB** and **Postgres** for storing fitness activities and user data
- **Gemini.AI** for recommendation processing
- **Spring AMQP** for queue/exchange/ binding setup
- Future plans: React or Angular frontend, mobile integration

---

## Getting Started

### Prerequisites

- Java 17+
- Maven or Gradle
- RabbitMQ running locally on `localhost:5672`
- MongoDB instance available on `localhost:27017`
- Eureka server running at `http://localhost:8761`

### Running Locally

1. Clone the repository:
   ```sh
   git clone https://github.com/thesaddamsyed/fitness-microservices.git
   cd fitness-microservices
   ```
