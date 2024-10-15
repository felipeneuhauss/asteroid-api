
# Asteroids API

This is an API application built with Express.js that provides information about asteroids, with data retrieved directly from NASA's API. The app also allows users to mark asteroids as favorites and store them in a SQLite database.

## Requirements

- Node.js (v16 or higher)
- npm (or yarn, if preferred)
- SQLite

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/username/asteroid-api.git
   cd asteroid-api
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

The server will start on `http://localhost:3000` by default.

## Usage

### Endpoints and Payloads

1. **Get a List of Asteroids**

   - **Endpoint**: `GET /api/asteroids`
   - **Query Parameters**:
     - `start_date` (required): Start date in `YYYY-MM-DD` format.
     - `end_date` (required): End date in `YYYY-MM-DD` format.
   - **Example Request**:
     ```bash
     curl "http://localhost:3000/api/asteroids?start_date=2023-01-01&end_date=2023-01-02"
     ```

2. **Get Details of a Specific Asteroid**

   - **Endpoint**: `GET /api/asteroids/:id`
   - **Path Parameter**:
     - `id` (required): The ID of the asteroid.
   - **Example Request**:
     ```bash
     curl "http://localhost:3000/api/asteroids/3542519"
     ```

3. **Add an Asteroid to Favorites**

   - **Endpoint**: `POST /api/favorites`
   - **Request Body** (JSON):
     ```json
     {
       "id": "3542519",
       "name": "Sample Asteroid",
       "details": "Description of the asteroid."
     }
     ```
   - **Example Request**:
     ```bash
     curl -X POST "http://localhost:3000/api/favorites" -H "Content-Type: application/json" -d '{"id": "3542519", "name": "Sample Asteroid", "details": "Description of the asteroid."}'
     ```

4. **Get List of Favorite Asteroids**

   - **Endpoint**: `GET /api/favorites`
   - **Example Request**:
     ```bash
     curl "http://localhost:3000/api/favorites"
     ```

5. **Delete an Asteroid from Favorites**

   - **Endpoint**: `DELETE /api/favorites/:id`
   - **Path Parameter**:
     - `id` (required): The ID of the asteroid to delete.
   - **Example Request**:
     ```bash
     curl -X DELETE "http://localhost:3000/api/favorites/3542519"
     ```

## Running Tests

This project uses Playwright for testing. Make sure the server is running, then run the following command:

```bash
npx playwright test
```

This will run tests to verify the endpoints and ensure the routes for favorites and asteroids are functioning as expected.

## Troubleshooting

1. **404 Errors in Tests**:
   - Ensure the server is running on the correct port and the routes match the `BASE_URL` specified in the tests.

2. **Dependency Issues**:
   - Run `npm install` to make sure all necessary dependencies are installed.

3. **Playwright Errors**:
   - Try reinstalling Playwright using `npx playwright install`.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
