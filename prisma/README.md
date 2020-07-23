# Foreword

Pbench Dashboard Backend is a server side platform for storing and retrieving information to enable productivity within Pbench Dashboard. The platform allows for interaction between the React frontend and Postgres database by exposing a GraphQL API Server. This API server is powered by Prisma in order to enable high performance querying, a GUI client for visualizing queries, and a realtime event system for database event tracking.

# Scaffolding

```bash
├── src
│   ├── generated
│   │   ├── prisma-client
│   │   │   ├── index.d.ts        # typescript schema definition
│   │   │   ├── index.js          # Prisma client entrypoint
│   │   │   └── prisma-schema.js  # generated Prisma client schema
│   ├── index.js                  # Apollo server entrypoint
│   ├── resolvers.js              # Apollo server resolvers
│   └── typeDefs.js               # Apollo server schema
├── datamodel.prisma              # schema definitions for GraphQL data model
├── prisma.yml                    # configuration for Prisma client
├── package.json                  # project dependencies
├── README.md
```

# Prisma Deployment

#### Step 1: Install node modules

```bash
$ npm install
```

#### Step 2: Install the Prisma CLI

Prisma services are managed with the [Prisma CLI](!alias-je3ahghip5). You can install it using `npm` (or `yarn`).

<Instruction>

Open your terminal and run the following command to install the Prisma CLI:

```
npm install -g prisma
# or
# yarn global add prisma
```

#### Step 3: Deploy the Prisma datamodel

```bash
$ prisma deploy
```
