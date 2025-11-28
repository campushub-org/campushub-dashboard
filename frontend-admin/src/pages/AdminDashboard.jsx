// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import AdminControls from '../components/AdminControls'; // NOUVEAU
import TimetableViewer from '../components/TimetableViewer'; 

const TABS = {
    DASHBOARD: 'Aperçu Admin',
    USERS: 'Gestion Utilisateurs',
    GENERATION: 'Planification EDTs',
    COURS: "Emploi du Temps des Cours",
    EXAMENS: "Emploi du Temps des Examens",
};

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState(TABS.USERS);
    
    // Simule les infos de l'admin
    const adminInfo = { 
        name: "Admin Principal", 
        role: "Administrateur Système",
        totalUsers: 250 // Mock data
    };

    const renderContent = () => {
        switch (activeTab) {
            case TABS.DASHBOARD:
                return (
                    <div style={{ padding: '20px' }}>
                        <div style={styles.cardGrid}>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Total Utilisateurs</h3>
                                <p style={styles.statValue}>{adminInfo.totalUsers}</p>
                            </div>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Cours Planifiés</h3>
                                <p style={styles.statValue}>100%</p>
                            </div>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Supports Validés</h3>
                                <p style={styles.statValue}>95</p>
                            </div>
                        </div>
                    </div>
                );
            case TABS.USERS:
                // 1. Accès à la liste des utilisateurs + Recherche/Suppression
                return <AdminControls type="users" />;
            case TABS.GENERATION:
                // 2. Génération de l'emploi de temps
                return <AdminControls type="generation" />;
            case TABS.COURS:
                // 3. Consultation des emplois du temps (vue globale)
                return <TimetableViewer type="cours" isDeanView={true} isDeanView={true} />; 
            case TABS.EXAMENS:
                // 3. Consultation des emplois du temps (vue globale)
                return <TimetableViewer type="examens" isDeanView={true} isDeanView={true} />;
            default:
                return null;
        }
    };

    // --- Styles (Harmonisation) ---
    const styles = {
        mainLayout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f9' },
        sidebar: { width: '250px', backgroundColor: '#1f2937', color: 'white', padding: '20px 0', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' },
        logo: { fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px', color: '#03a9f4' }, // Nouvelle couleur pour l'Admin
        menuItem: { padding: '12px 20px', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', position: 'relative' },
        menuItemActive: { backgroundColor: '#03a9f4', borderLeft: '4px solid white' },
        contentArea: { flexGrow: 1, padding: '30px' },
        header: { marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' },cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', padding: '20px 0' },
        statCard: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderLeft: '5px solid #03a9f4' },
        statTitle: { fontSize: '14px', color: '#6b7280', marginBottom: '8px' },
        statValue: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' },
    };

    const handleMouseEnter = (e) => e.currentTarget.style.backgroundColor = '#374151';
    const handleMouseLeave = (e) => e.currentTarget.style.backgroundColor = activeTab === e.currentTarget.dataset.tab ? styles.menuItemActive.backgroundColor : 'transparent';


    return (
        <div style={styles.mainLayout}>
            {/* Colonne de Navigation (Sidebar) */}
            <div style={styles.sidebar}>
                <div style={styles.logo}>CampusHub Admin ⚙️</div>
                {Object.values(TABS).map(tab => (
                    <div
                        key={tab}
                        data-tab={tab}
                        style={{ ...styles.menuItem, ...(activeTab === tab ? styles.menuItemActive : {}) }}
                        onClick={() => setActiveTab(tab)}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* Contenu Principal */}
            <div style={styles.contentArea}>
                <header style={styles.header}>
                    <h1 style={{ color: '#1f2937', fontSize: '24px' }}>Espace Administrateur - {activeTab}</h1>
                </header>
                
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminDashboard;
