import React from 'react';

export const ArchitectPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Project Architecture</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Frontend</h2>
        <p>The frontend is built using React and Vite. They handle the user interface and interactions.</p>
        <p>The main components include:</p>
        <ul>
          <li><strong>App.jsx:</strong> The entry point of the frontend, managing the routes and rendering the header.</li>
          <li><strong>PageChange:</strong> A component that allows navigation between different pages.</li>
          <li><strong>Routes:</strong> Manages the routes and directs the user to different pages such as TablePage and ArchitectPage.</li>
        </ul>
        <ul>
          <li><strong>TablePage:</strong> Displays and manages CSV data, including uploading, Deleting and interacting with files.</li>
          <li><strong>ArchitectPage:</strong> Explains the architecture of the project.</li>
          <li><strong>NotFoundPage:</strong> Shown when a user navigates to a non-existent page.</li>
        </ul>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Backend</h2>
        <p>The backend is powered by Flask, which handles the API endpoints for file uploads, data retrieval, and file management.</p>
        <br></br>
        <p><strong>Key points include:</strong></p>
        <ul>
          <li><strong>Flask App:</strong> Handles requests from the frontend and serves data.</li>
          <p></p>
          <li><strong>Endpoints:</strong> 
            <ul>
              <li><strong>/upload_csv:</strong> Receives and stores CSV files.</li>
              <li><strong>/list_files:</strong> Lists available files.</li>
              <li><strong>/get_data/&lt;filename&gt;:</strong> Retrieves CSV data for a specific file.</li>
              <li><strong>/delete_file/&lt;filename&gt;:</strong> Deletes a specific file.</li>
            </ul>
          </li>
          <p></p>
          <li><strong>SQLite:</strong> Used for storing the CSV data in tables.</li>
        </ul>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Database</h2>
        <p>The project uses SQLite as the database for storing CSV data. Each uploaded CSV file is stored as a table within the SQLite database, allowing for easy data management and retrieval.</p>
      </div>
    </div>
  );
};
