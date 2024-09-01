from flask import Flask, request, jsonify, send_file
import pandas as pd
import sqlite3
import os
from io import BytesIO  # Change from StringIO to BytesIO

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Database setup
def init_db():
    conn = sqlite3.connect('database.db')
    return conn

# CORS setup
from flask_cors import CORS
CORS(app)

@app.route('/')
def home():
    return "Welcome to the Data Visualization Project!"

# Endpoint to handle CSV upload
@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save the file
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # Read CSV into DataFrame
    try:
        df = pd.read_csv(file_path)
    except pd.errors.EmptyDataError:
        return jsonify({"error": "No data in CSV"}), 400
    except pd.errors.ParserError:
        return jsonify({"error": "Error parsing CSV"}), 400

    # Store DataFrame in the database
    conn = init_db()
    try:
        df.to_sql(file.filename, conn, if_exists='replace', index=False)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify({"message": "CSV uploaded and stored successfully!"}), 200

# Endpoint to list files
@app.route('/list_files', methods=['GET'])
def list_files():
    try:
        file_list = [f for f in os.listdir(app.config['UPLOAD_FOLDER']) if os.path.isfile(os.path.join(app.config['UPLOAD_FOLDER'], f))]
        return jsonify(file_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to get file data as CSV
@app.route('/get_data/<filename>', methods=['GET'])
def get_data(filename):
    try:
        conn = init_db()
        df = pd.read_sql_query(f"SELECT * FROM '{filename}'", conn)
        conn.close()

        # Convert DataFrame to CSV
        csv_data = df.to_csv(index=False)

        # Create a BytesIO object and write CSV data to it
        csv_io = BytesIO()
        csv_io.write(csv_data.encode('utf-8'))  # Encode CSV data to bytes
        csv_io.seek(0)

        return send_file(
            csv_io,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f"{filename}.csv"
        )
    except pd.io.sql.DatabaseError as e:
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to delete file
@app.route('/delete_file/<filename>', methods=['DELETE'])
def delete_file(filename):
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            conn = init_db()
            conn.execute(f"DROP TABLE IF EXISTS '{filename}'")
            conn.close()
            return jsonify({"message": "File deleted successfully!"}), 200
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
