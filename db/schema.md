# Database Schema

Users (  
    user_id PK  
    email UNIQUE  
    password_hash  
    name  
    role (patron, librarian, admin)  
    created_at  
)

Library_cards (  
    card_number PK  
    user_id FK  
    issued_at  
    active  
)  

Books (  
    isbn PK  
    title  
    genre  
    date_published  
    publisher  
    author  
)

Copies (  
    barcode PK  
    isbn FK  
    status (available, checked_out, lost)  
)

Checkouts (  
    checkout_id PK  
    user_id FK  
    barcode FK
    checkout_date  
    due_date  
    return_date NULL  
)

Holds (  
    hold_id PK  
    user_id FK  
    isbn FK  
    date_placed  
)
