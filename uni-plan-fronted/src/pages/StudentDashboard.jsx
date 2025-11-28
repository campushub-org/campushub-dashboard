// src/pages/StudentDashboard.jsx
import React, { useState } from 'react';
import SupportsList from '../components/SupportsList';
import TimetableViewer from '../components/TimetableViewer';

const TABS = {
    DASHBOARD: 'Tableau de Bord',
    SUPPORTS: 'Supports de Cours',
    COURS: "Emploi du Temps des Cours",
    EXAMENS: "Emploi du Temps des Examens",
};

function StudentDashboard() {
    // État pour gérer l'élément actif du menu latéral
    const [activeTab, setActiveTab] = useState(TABS.SUPPORTS);
    
    // Simule les informations de l'étudiant
    const studentInfo = { 
        id: 123, 
        name: "Alice Dupont", 
        level: "L3-INFO",
        promo: "Groupe A",
        credits: 90
    };

    const renderContent = () => {
        switch (activeTab) {
            case TABS.DASHBOARD:
                // Tableau de bord simple inspiré de l'image (données factices)
                return (
                    <div style={{ padding: '20px' }}>
                        <div style={styles.cardGrid}>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Crédits Obtenus</h3>
                                <p style={styles.statValue}>{studentInfo.credits} / 180</p>
                            </div>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Prochain Cours</h3>
                                <p style={styles.statValue}>Algorithmique (A-201)</p>
                            </div>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Supports Disponibles</h3>
                                <p style={styles.statValue}>4 Nouveaux</p>
                            </div>
                        </div>
                    </div>
                );
            case TABS.SUPPORTS:
                return <SupportsList studentLevel={studentInfo.level} />;
            case TABS.COURS:
                return <TimetableViewer type="cours" studentLevel={studentInfo.level} />;
            case TABS.EXAMENS:
                return <TimetableViewer type="examens" studentLevel={studentInfo.level} />;
            default:
                return null;
        }
    };

    const styles = {
        mainLayout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f9' },
        sidebar: { width: '250px', backgroundColor: '#1f2937', color: 'white', padding: '20px 0', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' },
        logo: { fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px', color: '#4f46e5' },
        menuItem: { padding: '12px 20px', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center' },
        menuItemHover: { backgroundColor: '#374151' },
        menuItemActive: { backgroundColor: '#4f46e5', borderLeft: '4px solid white' },
        contentArea: { flexGrow: 1, padding: '30px' },
        header: { marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' },
        cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
        statCard: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
        statTitle: { fontSize: '14px', color: '#6b7280', marginBottom: '8px' },
        statValue: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' },
    };

    const handleMouseEnter = (e) => e.currentTarget.style.backgroundColor = styles.menuItemHover.backgroundColor;
    const handleMouseLeave = (e) => e.currentTarget.style.backgroundColor = activeTab === e.currentTarget.dataset.tab ? styles.menuItemActive.backgroundColor : 'transparent';

    return (
        <div style={styles.mainLayout}>
            {/* Colonne de Navigation (Sidebar) */}
            <div style={styles.sidebar}>
                <div style={styles.logo}>CampusHub 🎓</div>
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
                    <h1 style={{ color: '#1f2937', fontSize: '24px' }}>Espace Étudiant - {activeTab}</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Niveau: {studentInfo.level} | Promo: {studentInfo.promo}</p>
                </header>
                
                {renderContent()}
            </div>
        </div>
    );
}

export default StudentDashboard;

