```mermaid
erDiagram
    users {
        serial id PK
        text username
        text password
        timestamp created_at
    }

    actresses {
        serial id PK
        text name
        text description
        timestamp created_at
    }

    evaluations {
        serial id PK
        integer user_id FK
        integer actress_id FK
        decimal looks_rating
        decimal sexy_rating
        decimal elegant_rating
        text comment
        timestamp created_at
        timestamp updated_at
    }

    users ||--o{ evaluations : "has"
    actresses ||--o{ evaluations : "receives"
```