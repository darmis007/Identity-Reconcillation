# Identity Service

The Identity Service is a TypeScript-based backend REST API that provides identity management functionality. It allows users to identify contacts based on their email addresses and phone numbers.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/darmis007/Identity-Reconcillation.git
   ```

2. Navigate to the project directory:

   ```
   cd Identity-Reconcillation
   ```
3. Build and start the application using `docker-compose`:
   ```
   docker-compose up --build 
   ```
This command will build the Docker images for the application and its dependencies, and start the containers.
5. The Identity Service is now running on `http://localhost:3000`. You can test the API endpoints using tools like Postman or cURL.

## Usage

The Identity Service provides the following endpoints:

- `POST /identity/identify`: Identify a contact based on their email or phone number.

  Example request:

  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{
    "email": "john@example.com",
    "phoneNumber": "+1234567890"
  }' http://localhost:3000/identity/identify
  ```

  Example response:

  ```json
  {
    "contact": {
      "primaryContactId": 1,
      "emails": ["john@example.com"],
      "phoneNumbers": ["+1234567890"],
      "secondaryContactIds": []
    }
  }
  ```

## Running Tests

To run the tests for the Identity Service, use the following command:

```bash
npm test
```

This command will execute the test cases and provide the test results.
