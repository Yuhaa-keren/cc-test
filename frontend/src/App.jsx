import React, { useState, useEffect } from 'react';

const fallbackTeam = [
  {
    "nama": "Deidanisa Aulia Pradina Kya",
    "nim": "102022300099",
    "foto": "/fotos/kya.jpeg",
    "email": "deidanisaaulia@student.telkomuniversity.ac.id"
  },
  {
    "nama": "Naufal Yuha Noor Faza",
    "nim": "102022300155",
    "foto": "/fotos/yuha.jpeg",
    "email": "naufalyuhanoor@student.telkomuniversity.ac.id"
  },
  {
    "nama": "Yoas R. Christian Jati",
    "nim": "102022330128",
    "foto": "/fotos/yoas.jpeg",
    "email": "yoascj@student.telkomuniversity.ac.id"
  },
  {
    "nama": "Aisyah Amaliah Sumidra",
    "nim": "102022330123",
    "foto": "/fotos/aisyah.jpeg",
    "email": "aisyahamaliahs@student.telkomuniversity.ac.id"
  }
];

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Routing and Auth states
  const [page, setPage] = useState('login'); // 'login' | 'menu' | 'dashboard' | 'profile'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  // untuk akses API project cct
  const fetchData = () => {
    setLoading(true);
    setError(null);
    fetch('/api/team')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gagal mengambil data dari server Flask');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message || 'Koneksi ke backend Flask gagal. Pastikan backend berjalan di http://localhost:5001');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError(null);

    // Simple validation (admin / admin)
    if (usernameInput.trim().toLowerCase() === 'admin' && passwordInput === 'admin') {
      setIsAuthenticated(true);
      setPage('menu');
    } else {
      setLoginError('Username atau password salah! (Gunakan admin/admin)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    setPage('login');
  };

  // Mendapatkan inisial untuk fallback avatar yang indah
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Mencari detail profile (menggabungkan data API/fallback dengan data profil tambahan)
  const getMemberDetails = (member) => {
    const fallback = fallbackTeam.find(m => m.nim === member.nim) || {};
    return {
      ...member,
      email: fallback.email || `${member.nim}@student.telkomuniversity.ac.id`
    };
  };

  // Data team yang akan digunakan di Menu/Profil (menggunakan data API jika ada, jika tidak ada fallback)
  const teamMembers = data?.team || fallbackTeam;

  return (
    <div className="app-container">


      {/* Navigation Header jika sudah Login */}
      {isAuthenticated && (
        <nav className="nav-header">
          <div className="nav-user">
            Masuk sebagai: <strong>{usernameInput}</strong>
          </div>
          <div className="nav-actions">
            {page !== 'menu' && (
              <button className="btn-secondary" onClick={() => setPage('menu')}>
                Menu Utama
              </button>
            )}
            <button className="btn-logout" onClick={handleLogout}>
              Keluar
            </button>
          </div>
        </nav>
      )}

      {/* 1. HALAMAN LOGIN */}
      {page === 'login' && (
        <div className="login-container">
          <div className="login-card">
            <header style={{ marginBottom: '1.5rem' }}>
              <span className="app-badge">Kelompok Bismillah A</span>
              <h2 className="login-title">Selamat Datang</h2>
              <p className="login-subtitle">Silakan login untuk mengakses Dashboard</p>
            </header>

            {loginError && <div className="login-error">{loginError}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Masukkan username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Masukkan password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Masuk
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. HALAMAN MENU UTAMA */}
      {page === 'menu' && (
        <div className="menu-container">
          <div className="menu-banner">
            <h2 className="menu-banner-title">Menu Utama Dashboard</h2>
            <p className="menu-banner-desc">
              Selamat datang di portal tugas besar Komputasi Awan. Dari sini Anda dapat memantau integrasi API Multi-Service atau melihat profil detail masing-masing anggota.
            </p>
            <button className="btn-primary-large" onClick={() => setPage('dashboard')}>
              Buka Dashboard & Status Server
            </button>
          </div>

          <div className="menu-section-title">
            Profile Anggota Kelompok
          </div>

          <div className="menu-grid">
            {teamMembers.map((member, index) => {
              const detailed = getMemberDetails(member);
              return (
                <div
                  className="menu-card clickable-card"
                  key={index}
                  onClick={() => {
                    setSelectedMember(detailed);
                    setPage('profile');
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="avatar-wrapper">
                    <img
                      className="avatar-image"
                      src={detailed.foto}
                      alt={`Foto ${detailed.nama}`}
                      onLoad={(event) => {
                        const placeholder = event.target.parentNode.querySelector('.avatar-placeholder');
                        if (placeholder) placeholder.style.display = 'none';
                      }}
                      onError={(event) => {
                        event.target.onerror = null;
                        event.target.style.display = 'none';
                        const placeholder = event.target.parentNode.querySelector('.avatar-placeholder');
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                    <div className="avatar-placeholder">
                      {getInitials(detailed.nama)}
                    </div>
                  </div>
                  <h3 className="menu-card-name">{detailed.nama}</h3>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. HALAMAN PROFILE DETAIL */}
      {page === 'profile' && selectedMember && (
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-layout">
              <div className="profile-avatar-wrapper">
                <img
                  className="profile-avatar"
                  src={selectedMember.foto}
                  alt={`Foto ${selectedMember.nama}`}
                  onError={(e) => {
                    // Fallback jika foto tidak ditemukan
                    e.target.onerror = null;
                    e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedMember.nama)}`;
                  }}
                />
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{selectedMember.nama}</h2>
                <span className="profile-nim-badge">NIM: {selectedMember.nim}</span>

                <div className="profile-meta-grid">
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Surel (Email)</span>
                    <span className="profile-meta-value">{selectedMember.email}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Universitas</span>
                    <span className="profile-meta-value">Telkom University</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Program Studi</span>
                    <span className="profile-meta-value">S1 Sistem Informasi</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setPage('menu')}>
                Kembali ke Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. HALAMAN DASHBOARD / SERVER STATUS (ORIGINAL VIEW) */}
      {page === 'dashboard' && (
        <>
          <header className="app-header">
            <span className="app-badge">Tugas Besar Komputasi Awan</span>
            <h1 className="app-title">Dashboard Kelompok Bismillah A</h1>
            <p className="app-subtitle">
              Aplikasi full-stack terintegrasi React.js dan Python Flask dengan arsitektur multi-service serta monitoring Load Balancer.
            </p>
          </header>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Sedang mengambil data dari Flask backend...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h3>Terjadi Kesalahan</h3>
              <p style={{ marginTop: '0.5rem', color: '#f87171' }}>{error}</p>
              <button className="retry-button" onClick={fetchData}>
                Coba Hubungkan Ulang
              </button>
            </div>
          )}

          {!loading && !error && data && (
            <div className="team-grid">
              {data.team && data.team.map((member, index) => (
                <div className="member-card" key={index}>
                  <div className="avatar-wrapper">
                    <img
                      className="avatar-image"
                      src={member.foto}
                      alt={`Foto ${member.nama}`}
                      onLoad={(event) => {
                        const placeholder = event.target.parentNode.querySelector('.avatar-placeholder');
                        if (placeholder) placeholder.style.display = 'none';
                      }}
                      onError={(event) => {
                        event.target.onerror = null;
                        event.target.style.display = 'none';
                        const placeholder = event.target.parentNode.querySelector('.avatar-placeholder');
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                    <div className="avatar-placeholder">
                      {getInitials(member.nama)}
                    </div>
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{member.nama}</h3>
                    <span className="member-nim">{member.nim}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', zIndex: 10 }}>
            <button className="btn-secondary" onClick={() => setPage('menu')}>
              Kembali ke Menu
            </button>
          </div>
        </>
      )}

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Komputasi Awan. Dibuat dengan React & Flask.</p>
      </footer>
    </div>
  );
}

export default App;
