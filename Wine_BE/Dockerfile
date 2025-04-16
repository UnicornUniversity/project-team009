# Use a Maven build image to compile the Java application
FROM maven:3.8.4-openjdk-17-slim AS build

# Copy the source code into the container
COPY . /app

# Set the working directory to the location of the pom.xml file
WORKDIR /app

# Build the Java application using Maven (skipping tests)
RUN mvn clean install -DskipTests

# Use a Java runtime as a base image
FROM openjdk:17-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the compiled JAR file from the build stage into the runtime container
COPY --from=build /app/target/whiskey-be-0.0.1-SNAPSHOT.jar /app/whiskey-be-0.0.1-SNAPSHOT.jar

# Expose the port your app runs on
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "whiskey-be-0.0.1-SNAPSHOT.jar"]
