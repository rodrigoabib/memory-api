# Knowledge Graph REST API

A RESTful API implementation of the Knowledge Graph Memory Server that enables persistent memory using a local knowledge graph. This allows systems to remember information across sessions.

## Features

- Store and retrieve information in a graph structure with entities, relations, and observations
- Full CRUD operations for entities, relations, and observations
- Search functionality for finding specific information
- Simple and intuitive REST API design

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/knowledge-graph-api.git
cd knowledge-graph-api

# Install dependencies
npm install

# Start the server
npm start
```

## Environment Variables

- `PORT`: HTTP port for the API server (default: 3000)
- `MEMORY_FILE_PATH`: Custom path to the memory storage file (default: `memory.json` in the project root)

## API Documentation

### Graph Operations

#### GET `/api/graph`

Get the entire knowledge graph.

**Response:**
```json
{
  "entities": [...],
  "relations": [...]
}
```

#### GET `/api/graph/search?query=searchterm`

Search for nodes in the knowledge graph.

**Query Parameters:**
- `query`: Search term to match against entity names, types, and observations

**Response:**
```json
{
  "entities": [...],
  "relations": [...]
}
```

#### POST `/api/graph/nodes`

Get specific nodes by name.

**Request Body:**
```json
{
  "names": ["John_Smith", "Anthropic"]
}
```

**Response:**
```json
{
  "entities": [...],
  "relations": [...]
}
```

### Entity Operations

#### POST `/api/entities`

Create new entities.

**Request Body:**
```json
{
  "entities": [
    {
      "name": "John_Smith",
      "entityType": "person",
      "observations": ["Speaks fluent Spanish"]
    }
  ]
}
```

**Response:**
```json
[
  {
    "name": "John_Smith",
    "entityType": "person",
    "observations": ["Speaks fluent Spanish"]
  }
]
```

#### DELETE `/api/entities`

Delete entities and their associated relations.

**Request Body:**
```json
{
  "entityNames": ["John_Smith"]
}
```

**Response:**
```json
{
  "message": "Entities deleted successfully"
}
```

### Relation Operations

#### POST `/api/relations`

Create new relations between entities.

**Request Body:**
```json
{
  "relations": [
    {
      "from": "John_Smith",
      "to": "Anthropic",
      "relationType": "works_at"
    }
  ]
}
```

**Response:**
```json
[
  {
    "from": "John_Smith",
    "to": "Anthropic",
    "relationType": "works_at"
  }
]
```

#### DELETE `/api/relations`

Delete relations from the knowledge graph.

**Request Body:**
```json
{
  "relations": [
    {
      "from": "John_Smith",
      "to": "Anthropic",
      "relationType": "works_at"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Relations deleted successfully"
}
```

### Observation Operations

#### POST `/api/observations`

Add observations to existing entities.

**Request Body:**
```json
{
  "observations": [
    {
      "entityName": "John_Smith",
      "contents": ["Graduated in 2019", "Prefers morning meetings"]
    }
  ]
}
```

**Response:**
```json
[
  {
    "entityName": "John_Smith",
    "addedObservations": ["Graduated in 2019", "Prefers morning meetings"]
  }
]
```

#### DELETE `/api/observations`

Delete observations from entities.

**Request Body:**
```json
{
  "deletions": [
    {
      "entityName": "John_Smith",
      "observations": ["Prefers morning meetings"]
    }
  ]
}
```

**Response:**
```json
{
  "message": "Observations deleted successfully"
}
```

## Data Structure

### Entities
Entities are the primary nodes in the knowledge graph. Each entity has:
- A unique name (identifier)
- An entity type (e.g., "person", "organization", "event")
- A list of observations

Example:
```json
{
  "name": "John_Smith",
  "entityType": "person",
  "observations": ["Speaks fluent Spanish"]
}
```

### Relations
Relations define directed connections between entities. They are always stored in active voice and describe how entities interact or relate to each other.

Example:
```json
{
  "from": "John_Smith",
  "to": "Anthropic",
  "relationType": "works_at"
}
```

### Observations
Observations are discrete pieces of information about an entity. They are:
- Stored as strings
- Attached to specific entities
- Can be added or removed independently
- Should be atomic (one fact per observation)

## License

This project is available under the MIT License. See the LICENSE file for more information.
