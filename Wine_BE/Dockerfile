# 1. Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS builder
<<<<<<< HEAD

WORKDIR /app

# Copy Maven config and source code
COPY pom.xml .
COPY src ./src

# Build the application without running tests
RUN mvn clean package -DskipTests

# 2. Runtime stage
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Run the app
=======
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 2. Runtime stage
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
>>>>>>> e700d9516418b38f471f5f40b8200fae0492b434
ENTRYPOINT ["java", "-jar", "app.jar"]
