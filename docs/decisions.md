# Project Decisions  
## Tech-Stack  
**Database:** PostgreSQL  
Chosen because of extensive language support and high industry usage.  

**Backend:** Node.js  
Chosen to gain experience developing RESTful APIs.  

**Frontend:** JavaScript  
Chosen to incorporate 

## Authentication & Roles
Users are assigned a role (patron, librarian, admin) which determines backend access.
Role-based access is enforced in backend logic and reflected in frontend views.

## Database Design

### Books vs Copies
Books and physical copies are modeled separately to reflect real-world library circulation.  
This allows individual copies to be tracked, lost, or checked out independently.  

### Checkouts Table
Each checkout has a unique ID to support checkout history.  
Overdue status is derived from due dates rather than stored directly.  

### Holds
Holds are placed on books (ISBN) rather than copies.  
This ensures fair, first-come-first-served allocation when any copy becomes available.  
