import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import mysql.connector

# Memuat variabel dari file .env
load_dotenv()

app = Flask(__name__)
# Mengaktifkan CORS agar frontend (React) dapat mengakses API Flask
CORS(app)

# Konfigurasi Database MySQL dari Environment Variables
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'db_tubes')
}

def get_db_connection():
    """Membuat dan mengembalikan koneksi baru ke database MySQL."""
    return mysql.connector.connect(**DB_CONFIG)


@app.route('/api/team', methods=['GET'])
def get_team():
    """
    Endpoint utama yang mengambil data anggota kelompok dari tabel 'anggota_kelompok'
    di database MySQL, serta mengembalikan SERVER_ID untuk indikator Load Balancer.
    """
    server_id = os.getenv('SERVER_ID', 'Localhost')

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM anggota_kelompok")
        team_members = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify({
            "server_id": server_id,
            "team": team_members
        })

    except mysql.connector.Error as err:
        return jsonify({
            "server_id": server_id,
            "error": f"Database error: {str(err)}",
            "team": []
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Endpoint health check untuk AWS ALB Target Group.
    ALB akan melakukan ping ke endpoint ini untuk memastikan instance sehat.
    """
    server_id = os.getenv('SERVER_ID', 'Localhost')
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({"status": "healthy", "server_id": server_id})
    except mysql.connector.Error:
        return jsonify({"status": "unhealthy", "server_id": server_id}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
