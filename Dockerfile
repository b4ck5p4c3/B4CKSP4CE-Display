# --- Stage 1: build frontend ---
FROM node:20-bookworm-slim AS frontend
WORKDIR /app/web-sources
COPY web-sources/package.json web-sources/package-lock.json ./
RUN npm install -g npm@9 && npm ci
COPY web-sources/ ./
RUN npm run build

# --- Stage 2: build backend (jar with embedded frontend) ---
FROM eclipse-temurin:17-jdk-jammy AS backend
WORKDIR /app
COPY .mvn ./.mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B -q -DskipTests dependency:resolve dependency:resolve-plugins || true
COPY src ./src
COPY web-sources/build.sh ./web-sources/
COPY --from=frontend /app/web-sources/build ./web-sources/build
RUN ./mvnw -B -DskipTests -Dexec.skip=true package

# --- Stage 3: runtime ---
FROM eclipse-temurin:17-jre-jammy
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=backend /app/target/spaceDisplay.jar ./spaceDisplay.jar

ENV DATA_PATH=/data \
    BASE_URL=http://localhost:8080 \
    PRINTER=none \
    SERIAL_PORT="" \
    DISPLAY_WIDTH=40 \
    DISPLAY_HEIGHT=32 \
    JAVA_OPTS="-Xmx1024m"

EXPOSE 8080
VOLUME ["/data"]

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/spaceDisplay.jar \
  --data.path=$DATA_PATH \
  --server.baseUrl=$BASE_URL \
  --display.printer=$PRINTER \
  ${SERIAL_PORT:+--display.printer.serial.port=$SERIAL_PORT} \
  --display.width=$DISPLAY_WIDTH \
  --display.height=$DISPLAY_HEIGHT \
  \"$@\"", "--"]
