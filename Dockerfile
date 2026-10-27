# Multi-stage Dockerfile for Spring Boot Java 21 Backend
# Stage 1: Build the application with Maven
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Install dos2unix to ensure line endings on mvnw are UNIX-compatible
RUN apk add --no-cache bash dos2unix

# Copy Maven wrapper and POM descriptor
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Convert line endings and make maven wrapper executable
RUN dos2unix mvnw && chmod +x mvnw

# Copy source code
COPY src/ src/

# Build production executable JAR (skipping tests during container image packaging)
RUN ./mvnw clean package -DskipTests

# Stage 2: Lightweight JRE Runtime environment
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create unprivileged application user for security best practices
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled JAR from builder stage
COPY --from=builder /app/target/RestAPIAssignment-*.jar app.jar

# Ensure proper ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose Spring Boot configured port
EXPOSE 8050

# Default environment variables (can be overridden at runtime)
ENV SERVER_PORT=8050 \
    SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/soataskdb \
    SPRING_DATASOURCE_USERNAME=root \
    SPRING_DATASOURCE_PASSWORD="" \
    SPRING_JPA_HIBERNATE_DDL_AUTO=update \
    CORS_ALLOWED_ORIGINS="*"

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8050/order/ || exit 1

# Launch the Spring Boot application
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
