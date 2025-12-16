# Database Schema

Users (
    user_id PK
    email
    name
    role
    dob
)

Books (
    isbn PK
    genre
    date_published
    publisher
    author
)

Copies (
    barcode PK
    isbn
    status (available, checked out, overdue, lost)
)

Checkouts (
    user_id
    barcode
    checkout_date
    return_date
    PK (user_id, barcode)
)

Holds (
    user_id
    barcode
    date_placed
    PK (user_id, barcode)
)
