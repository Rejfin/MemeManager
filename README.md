# MemeManager (WIP)
![LICENSE MIT](https://img.shields.io/badge/License-MIT-green)
![Typescript 4.9](https://img.shields.io/badge/Typescript-4.9-blue)
![Nodejs](https://img.shields.io/badge/Node.js-18-green)
![Reactjs](https://img.shields.io/badge/React.js-18-blue)

## Description
A meme collection management application. 
Thanks to the application the user can tag every file sent to the server, and then when he needs it he can search for it using the appropriate tag.

## Instalation
The recommended form of installation is to use docker images and docker compose

1. Create docker-compose.yml file like this:
```yml
version: "3"

services:
  db:
    image: postgres:15.2
    environment:
      - POSTGRES_DB=meme-manager
      - POSTGRES_USER=postgres # set your database user
      - POSTGRES_PASSWORD=postgres # set your database password
      - PGDATA=/data/postgres
      - PGPORT=2139 # database port
    networks:
      - meme-network
    volumes:
      - "./db:/data/postgres"
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postgres" ]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: on-failure
  api:
    image: rejfin/meme-manager-api:latest
    hostname: meme-api
    ports:
      - "2137:2137"
    volumes:
      - "./logs:/app/build/logs"
      - "./memes:/app/build/memes"
    networks:
      - meme-network
    depends_on:
      - db:
        condition: service_healthy
    env_file:
      - api.env
  frontend:
    image: rejfin/meme-manager-ui:latest
    ports:
      - "80:80"
    networks:
      - meme-network
    depends_on:
      - api
networks:
  meme-network:
    driver: bridge
```
2. Create an api.env file in the same folder as docker-compose.yml and complete it like this:
```env
API_PORT=2137

# DATABASE CONFIG

# name of the docker container with PostgreSql
PG_HOST="db"
# database user name (same as POSTGRES_USER in docker-compose.yml)
PG_USER="postgres"
# database password (same as POSTGRES_PASSWORD in docker-compose.yml)
PG_PASSWORD="postgres"
# database name (same as POSTGRES_DB in docker-compose.yml)
PG_DB="meme-manager"
# database port
PG_PORT=2139

# API CONFIG

# string used to generate JWT token (change it to yours)
TOKEN_SECRET="426b41c78f4911f06484f4d377c604cd5f4f63a961599791e83f"
# string used to generate refresh token (change it to yours)
TOKEN_REFRESH_SECRET="426b41c78fhgnfhr587hen5i8gn4g4578gn4g1e83f"
# jwt token expiration time
JWT_EXP="12h"
# refresh token expiration time
JWT_REFRESH_EXP="90d"
# log level, available levels: 'info', 'warn', 'error
LOG_LEVEL="info"
NODE_ENV=production
```

3. Start app using `docker compose up -d` command.

## Screenshots
<br><img src="https://user-images.githubusercontent.com/64009728/220725415-a5417898-94ac-405e-b423-7f1541489eec.png" width="320" height="180">
<img src="https://user-images.githubusercontent.com/64009728/220725418-769bb05d-fdf3-4638-a8b9-fe3be0d642de.png" width="320" height="180">
<img src="https://user-images.githubusercontent.com/64009728/220725420-e3aea25b-931f-4d65-a383-210b94d760db.png" width="320" height="180">
<img src="https://user-images.githubusercontent.com/64009728/220725446-c2576569-4069-4f90-a1e1-21d5a12db0ce.png" width="320" height="180">
<img src="https://user-images.githubusercontent.com/64009728/220725453-6c83955c-f5fe-4de1-b0c6-05497606ee9f.png" width="320" height="180">