# 🏃‍♂️ Fitness Microservices Platform

A modern, scalable fitness tracking platform built with microservices architecture. This project combines the power of Spring Boot, AI-driven insights, and real-time activity tracking to create a comprehensive fitness experience.

## What This Is

Think of this as your personal fitness companion that lives in the cloud. It's not just another workout tracker – it's a smart system that learns from your activities and provides personalized recommendations using AI. The beauty of the microservices approach is that each piece does one thing really well, making the whole system more reliable and easier to scale.

## 🏗️ Architecture Overview

The platform is built around several core services that work together seamlessly:

- **User Service** - Handles user accounts, profiles, and authentication
- **Activity Service** - Tracks workouts, runs, and fitness activities
- **AI Service** - Processes activity data and generates smart recommendations using Gemini.AI
- **API Gateway** - Routes requests and handles cross-cutting concerns
- **Service Discovery** - Eureka server that helps services find each other
- **Frontend** - React-based web interface with Material-UI

## 🚀 Why This Architecture Makes Sense

I chose microservices because fitness apps tend to grow in unexpected ways. Maybe you start with basic tracking, then want to add social features, nutrition tracking, or integration with wearable devices. With microservices, you can evolve each piece independently without breaking the whole system.

The asynchronous messaging with RabbitMQ is particularly clever here – when you log a workout, it gets processed in the background by the AI service. This means your app stays responsive even when the AI is crunching numbers to give you personalized advice.

## 🛠️ Tech Stack

### Backend

- **Java 21** with **Spring Boot 3.5.3** - Modern, fast, and well-supported
- **Spring Cloud** - Service discovery, configuration management, and load balancing
- **Spring Data JPA** - Clean data access layer
- **PostgreSQL** - Reliable relational database for user data
- **MongoDB** - Flexible document storage for activity data

### Messaging & Integration

- **RabbitMQ** - Reliable message queuing for service communication
- **Spring AMQP** - Clean integration with Spring ecosystem

### Frontend

- **React 18** with **Vite** - Fast development and building
- **Material-UI** - Professional, accessible components
- **Redux Toolkit** - Predictable state management
- **Axios** - HTTP client for API communication

### Infrastructure

- **Docker** - Containerization for easy deployment
- **Eureka** - Service discovery and registration
- **Spring Cloud Gateway** - API routing and load balancing

## 📁 Project Structure

```
fitness-microservice/
├── userservice/          # User management and authentication
├── activityservice/      # Workout and activity tracking
├── aiservice/           # AI-powered recommendations
├── gateway/             # API gateway and routing
├── eureka/              # Service discovery server
├── configserver/        # Centralized configuration
└── fitness-frontend/    # React web application
```

## 🚀 Getting Started

### Prerequisites

You'll need these running locally:

- **Java 21** (or 17+)
- **Maven** for building Java services
- **Node.js 18+** for the frontend
- **Docker** (optional, for containerized setup)

### Infrastructure Setup

1. **Start RabbitMQ** (the messaging backbone):

   ```bash
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```

2. **Start PostgreSQL**:

   ```bash
   docker run -d --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=fitness -p 5432:5432 postgres:15
   ```

3. **Start MongoDB**:
   ```bash
   docker run -d --name mongodb -p 27017:27017 mongo:7
   ```

### Running the Services

The services need to be started in this order:

1. **Eureka Server** (service discovery):

   ```bash
   cd eureka
   mvn spring-boot:run
   ```

2. **Config Server** (configuration management):

   ```bash
   cd configserver
   mvn spring-boot:run
   ```

3. **User Service**:

   ```bash
   cd userservice
   mvn spring-boot:run
   ```

4. **Activity Service**:

   ```bash
   cd activityservice
   mvn spring-boot:run
   ```

5. **AI Service**:

   ```bash
   cd aiservice
   mvn spring-boot:run
   ```

6. **API Gateway**:

   ```bash
   cd gateway
   mvn spring-boot:run
   ```

7. **Frontend**:
   ```bash
   cd fitness-frontend
   npm install
   npm run dev
   ```

### Service URLs

Once everything is running:

- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **Frontend**: http://localhost:5173
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

## 🔧 Configuration

Each service has its own `application.yml` with environment-specific settings. The config server centralizes common configurations, making it easy to manage across environments.

Key configuration areas:

- Database connections
- RabbitMQ settings
- Service discovery endpoints
- AI service API keys

## 🧪 Testing

The project includes comprehensive test coverage:

- Unit tests for business logic
- Integration tests for service communication
- End-to-end tests for critical user flows

Run tests with:

```bash
mvn test
```

## 🚢 Deployment

### Docker Compose

For local development, there's a `docker-compose.yml` that spins up all the infrastructure:

```bash
docker-compose up -d
```

### Production

Each service can be containerized independently:

```bash
mvn clean package
docker build -t fitness-service .
```

## 🔍 Monitoring & Observability

- **Spring Boot Actuator** - Health checks and metrics
- **Eureka Dashboard** - Service status and discovery
- **RabbitMQ Management** - Message queue monitoring

## 🤝 Contributing

This is a learning project, so contributions are welcome! Some areas that could use work:

- Enhanced error handling and resilience
- More comprehensive test coverage
- Performance optimization
- Additional AI features
- Mobile app development

## 📚 What I Learned Building This

Building this project taught me a lot about:

- **Service boundaries** - Figuring out what belongs where isn't always obvious
- **Async communication** - RabbitMQ makes services talk without tight coupling
- **Configuration management** - Centralized config is a game-changer for microservices
- **Service discovery** - Eureka makes the distributed system feel cohesive

## 🎯 Next Steps

The platform is solid, but there's always room to grow:

- **Real-time notifications** using WebSockets
- **Machine learning models** for better recommendations
- **Social features** - friend challenges, leaderboards
- **Wearable integration** - Fitbit, Apple Watch, Garmin
- **Nutrition tracking** - complete health picture

## 📞 Getting Help

If you run into issues:

1. Check the service logs for error details
2. Verify all infrastructure services are running
3. Ensure service discovery is working via Eureka
4. Check RabbitMQ connections and queues

---

_Built with ❤️ and lots of ☕. This project represents my journey into microservices architecture and modern Java development._
