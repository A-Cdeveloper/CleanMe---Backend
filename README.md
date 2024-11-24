# CleanMe Backend API

## Overview

This project is a backend REST API built using Next.js 15, designed to support the **CleanMe** frontend application. The backend provides essential endpoints and services required for CleanMe’s functionality, enabling efficient communication between the client and server to facilitate the reporting and management of communal problems.

## Features

- RESTful API structure for reliable data interactions.
- Seamless integration with the CleanMe frontend application.
- Endpoints for creating, updating, and retrieving reports of issues.
- Support for user authentication and authorization.
- Integration with a database for persistent data storage.
- Image upload capabilities for problem reports.

## Technologies Used

- **Next.js 15**: A React-based framework for building the API and handling server-side rendering.
- **Prisma**: An ORM for interacting with the MySQL database.
- **MySQL**: A relational database management system for storing data.
- **JWT**: JSON Web Tokens for secure user authentication.
- **Node.js**: JavaScript runtime used to build the backend.
- **Middleware**: Used for handling API security, validation, and error handling.

## API Endpoints

- **GET /api/problems**: Fetch all problem reports.
- **GET /api/problems/?status=status&cat_id=cat_id&\_sort=status&\_order=asc/desc** : Filter/sorting problems
- **POST /api/problems**: Create a new problem report.
- **GET /api/problems/id**: Fetch a specific problem by ID.
- **PUT /api/problems/id**: Update an existing problem.
- **DELETE /api/problems/id**: Delete a problem report.

- **GET /api/categories**: Fetch all problem categories.
- **GET /api/categories/id**: Fetch a specific problem category.

## License

This project is licensed under the MIT License.

## Contact

For questions, feedback, or issues, please reach out to:

- **Email**: [aleksandar@e-seo.info](mailto:aleksandar@e-seo.info)
