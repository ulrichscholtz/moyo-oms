# Order Management System (OMS)

## Overview  
The **Order Management System (OMS)** is a core component of the **Online Order Solution**. It enables vendors to manage product pricing, stock levels, and order allocation. The system processes incoming orders from the **Client Portal**, matches them with vendor inventory and pricing, and ensures accurate order updates.  

This repository represents the implementation of the OMS stream chosen from the case study project.

---

## Features  
- Vendor authentication using OAuth 2.0 / OpenID Connect  
- Configure product pricing per vendor  
- Inventory management for each vendor  
- Asynchronous communication:  
  - Receives new orders from the Client Portal  
  - Sends status updates back to the Client Portal  
- Order allocation engine:  
  - Allocates orders to vendors based on stock availability and price  
- Integration with Product Management System for synchronous product data retrieval  

---

## Technology Stack  
- **Frontend:** React
- **Backend:** Java (Spring Boot)  
- **Database:** Spring Data  
- **Authentication:** OpenID Connect  
- **Cloud:** Public Cloud (Azure) - PaaS  

---

## System Workflow  
1. The Client Portal submits a new order.  
2. The OMS receives the order asynchronously.  
3. OMS checks vendor inventory and pricing.  
4. OMS allocates the order to the most suitable vendor.  
5. OMS updates the Client Portal asynchronously with the order status.  
6. OMS communicates with the Product Management System synchronously for product details.  

---

## Getting Started  

### Prerequisites  
- Node.js and npm/yarn (for frontend)  
- Java JDK (17 or later recommended)  
- Maven or Gradle  
- Database (PostgreSQL, MySQL, or similar)  
- Cloud account (Azure or AWS)  

### Setup Instructions  
1. Clone the repository:  
   ```bash
   git clone https://github.com/ulrichscholtz/moyo-oms.git
   cd moyo-oms

2. Install dependencies (frontend and backend).

3. Configure database connection and OAuth provider.

4. Run the backend service:
   ```bash
   ./mvnw spring-boot:run

5. Run the frontend (React):
   ```bash
   npm start
