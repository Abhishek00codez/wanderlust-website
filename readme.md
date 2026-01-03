# Wanderlust

Wanderlust is a full-stack web application inspired by Airbnb, designed to help users discover and list unique places to stay. It allows users to create listings, upload photos, and write reviews.

## 🚀 Features

*   **Listings Management:** Users can create, read, update, and delete (CRUD) listings for accommodations.
*   **Review System:** Users can leave ratings and reviews for listings.
*   **User Authentication:** Secure signup and login functionality using Passport.js.
*   **Image Upload:** Integration with Cloudinary for storing listing images.
*   **MVC Architecture:** Follows the Model-View-Controller design pattern.
*   **Error Handling:** Robust error handling and validation using Joi.

## 🛠️ Tech Stack

*   **Frontend:** EJS (Embedded JavaScript templates), CSS, Bootstrap
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **Authentication:** Passport.js
*   **Cloud Storage:** Cloudinary
*   **Validation:** Joi

## 📂 Project Structure

```
major/
├── controllers/    # Logic for handling requests
├── init/           # Database initialization scripts
├── models/         # Mongoose schemas (Listing, Review, User)
├── public/         # Static assets (CSS, JS, Images)
├── routes/         # Express routes (listings, reviews, users)
├── utils/          # Utility functions (ExpressError, wrapAsync)
├── views/          # EJS templates
├── app.js          # Main application entry point
├── cloudConfig.js  # Cloudinary configuration
├── middleware.js   # Custom middleware
└── package.json    # Project dependencies
```

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd major
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    CLOUD_NAME=your_cloudinary_cloud_name
    CLOUD_API_KEY=your_cloudinary_api_key
    CLOUD_API_SECRET=your_cloudinary_api_secret
    ATLASDB_URL=your_mongodb_connection_string (or use local MONGO_URL)
    SECRET=your_session_secret
    ```

4.  **Initialize Database (Optional):**
    If you want to seed the database with sample data:
    ```bash
    node init/index.js
    ```

5.  **Run the Application:**
    ```bash
    node app.js
    ```

6.  **Access the App:**
    Open your browser and go to `http://localhost:8080`.

## 🏗️ Architecture

```mermaid
graph TD
    %% Nodes
    Client["Client Browser"]
    
    subgraph "Express Application (Node.js)"
        App["app.js Entry Point"]
        
        subgraph "Middleware Layer"
            AuthMW["Authentication Middleware<br/>(Passport.js)"]
            UploadMW["Upload Middleware<br/>(Multer)"]
            ValidationMW["Validation Middleware<br/>(Joi/Schema)"]
            SessionMW["Session & Flash"]
        end
        
        subgraph "Routing Layer"
            ListingsRouter["routes/listing.js"]
            ReviewsRouter["routes/review.js"]
            UsersRouter["routes/user.js"]
        end
        
        subgraph "Controller Layer"
            ListingsController["controllers/listings.js"]
            ReviewsController["controllers/reviews.js"]
            UsersController["controllers/users.js"]
        end
        
        subgraph "Data Layer (Mongoose Models)"
            ListingModel["models/listing.js"]
            ReviewModel["models/review.js"]
            UserModel["models/user.js"]
        end
        
        subgraph "View Layer (EJS)"
            Layouts["layouts/boilerplate.ejs"]
            ListingViews["views/listings/*.ejs"]
            UserViews["views/users/*.ejs"]
            Partials["includes/*.ejs"]
        end
    end

    DB[("MongoDB Database")]
    CloudStorage["Cloud Storage<br/>(Cloudinary)"]

    %% Relationships
    Client -- "HTTP Requests" --> App
    
    App -- "Uses" --> SessionMW
    App -- "Uses" --> AuthMW
    App -- "Mounts" --> ListingsRouter
    App -- "Mounts" --> ReviewsRouter
    App -- "Mounts" --> UsersRouter

    ListingsRouter -- "Uses" --> UploadMW
    ListingsRouter -- "Uses" --> ValidationMW
    ListingsRouter -- "Calls" --> ListingsController

    ReviewsRouter -- "Uses" --> ValidationMW
    ReviewsRouter -- "Calls" --> ReviewsController

    UsersRouter -- "Calls" --> UsersController

    ListingsController -- "Queries" --> ListingModel
    ReviewsController -- "Queries" --> ReviewModel
    UsersController -- "Queries" --> UserModel

    ListingModel -- "References" --> ReviewModel
    ListingModel -- "References" --> UserModel
    ReviewModel -- "References" --> UserModel

    ListingsController -- "Renders" --> ListingViews
    UsersController -- "Renders" --> UserViews
    
    ListingViews -- "Extends" --> Layouts
    ListingViews -- "Includes" --> Partials

    ListingModel <--> DB
    ReviewModel <--> DB
    UserModel <--> DB

    UploadMW -- "Uploads Files" --> CloudStorage
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the ISC License.
