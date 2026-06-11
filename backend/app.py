import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Mengaktifkan CORS agar frontend (React) dapat mengakses API Flask secara lokal
CORS(app)

@app.route('/api/team', methods=['GET'])
def get_team():
    # Mengambil nilai environment variable SERVER_ID, default ke 'Localhost' jika tidak diset
    server_id = os.environ.get('SERVER_ID', 'Localhost')
    
    # Data statis anggota kelompok sesuai spesifikasi
    team_members = [
        {
            "nama": "Deidanisa Aulia Pradina Kya",
            "nim": "102022300099",
            "foto": "/fotos/kya.jpeg"
        },
        {
            "nama": "Naufal Yuha Noor Faza",
            "nim": "102022300155",
            "foto": "/fotos/yuha.jpeg"
        },
        {
            "nama": "Yoas R. Christian Jati",
            "nim": "102022330128",
            "foto": "/fotos/yoas.jpeg"
        },
        {
            "nama": "Aisyah Amaliah Sumidra",
            "nim": "102022330123",
            "foto": "/fotos/aisyah.jpeg"
        }
    ]
    
    return jsonify({
        "server_indicator": server_id,
        "team": team_members
    })

if __name__ == '__main__':
    # Menjalankan server Flask di port 5001
    app.run(debug=True, host='0.0.0.0', port=5001)
