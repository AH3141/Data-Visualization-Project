# Data Visualization Project

This project is a data visualization web application that allows users to upload, manage, and interact with CSV files. The application includes various pages to handle different tasks, such as displaying data, explaining the project architecture, and handling errors for non-existent routes.

## Features

- **TablePage:** Displays and manages CSV data, including uploading and interacting with files.
- **ArchitectPage:** Explains the architecture of the project.
- **NotFoundPage:** Shown when a user navigates to a non-existent route, informing them that the page cannot be found.

## Technologies Used

- **Frontend:** React.js (with React Router for navigation)
- **Backend:** Flask (Python)
- **Database:** SQLite (for storing uploaded CSV data)
- **File Handling:** PapaParse (for parsing CSV files in the frontend)
- **Styling:** CSS (for styling the components)

## Getting Started

### Prerequisites

- Node.js (for running the frontend)
- Python (for running the Flask backend)
- SQLite (for the database)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/AH3141/Data-Visualization-Project.git
    cd datavisualizationproject
    ```

2. **Install frontend dependencies:**
    ```bash
    cd Data_Visualization_Project_Frontend
    npm install
    ```

3. **Install backend dependencies:**
    ```bash
    cd Data_Visualization_Project_Backend
    pip install -r requirements.txt
    ```

### Running the Application

1. **Start the backend server:**
    ```bash
    cd Data_Visualization_Project_Backend
    python app.py
    ```

2. **Start the frontend development server:**
    ```bash
    cd Data_Visualization_Project_Frontend
    npm run dev
    ```

3. **Open your browser and go to:**
    ```
    http://localhost:3000
    ```

### Usage

- **Upload CSV Files:** Use the `TablePage` to upload and manage CSV files. The uploaded files are stored in the SQLite database.
- **View Project Architecture:** Visit the `ArchitectPage` to see a description of the project's architecture.
- **Handle Errors:** If you navigate to a non-existent route, the `NotFoundPage` will inform you that the page cannot be found.

## Project Structure

- **/frontend:** Contains the React.js frontend code.
- **/backend:** Contains the Flask backend code.
- **/uploads:** Directory where uploaded CSV files are stored.
- **/database.db:** SQLite database file.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to the open-source community for providing the tools and libraries used in this project.
