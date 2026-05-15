# cypher-api

## Docker startup

Make sure Docker Desktop is running, then start the API and Neo4j:

```powershell
docker compose up --build
```

Open:

- App/API: http://localhost:3000
- Neo4j Browser: http://localhost:7474

Neo4j login for local Docker:

- Username: `neo4j`
- Password: `localpassword`

Stop the containers:

```powershell
docker compose down
```

Remove the local Neo4j data volume if you want a clean database:

```powershell
docker compose down -v
```

## Local Node startup

Copy `.env.example` to `.env`, update values if needed, then run:

```powershell
npm ci
npm start
```

Do not commit `.env` or `node_modules`.
