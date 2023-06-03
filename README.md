# Identity Service

The Identity Service is a TypeScript-based backend REST API that provides identity management functionality. It allows users to identify contacts based on their email addresses and phone numbers.

## Prerequisites

Before running the Identity Service, ensure that you have the following prerequisites installed on your system:

- Node.js
- npm (Node Package Manager)
- MySQL database

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/identity-service.git
   ```

2. Navigate to the project directory:

   ```bash
   cd src
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project's root directory and configure the following environment variables according to your MySQL database setup:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=projects
   DB_CLIENT=mysql2
   SERVER_PORT=3000
   ```

   Make sure to replace the values with your actual database credentials.

5. Compile the TypeScript code and start the server:

   ```bash
   npx tsc && node app.js
   ```

   This command will compile the TypeScript code into JavaScript and then start the server.

6. The Identity Service is now running on `http://localhost:3000`. You can test the API endpoints using tools like Postman or cURL.

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

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create a new issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).