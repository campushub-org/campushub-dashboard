// src/pages/DeanDashboard.jsx
import React, { useState } from 'react';
import SupportValidationQueue from '../components/SupportValidationQueue'; // NOUVEAU
import TimetableViewer from '../components/TimetableViewer'; 

const TABS = {
    DASHBOARD: 'Tableau de Bord',
    VALIDATION: 'Validation Supports (Queue)', // Accès aux supports soumis
    COURS: "Emploi du Temps des Cours (Global)",
    EXAMENS: "Emploi du Temps des Examens (Global)",
};

function DeanDashboard() {
    const [activeTab, setActiveTab] = useState(TABS.VALIDATION);
    
    // Simule les informations du doyen (ID non strictement nécessaire pour l'affichage ici)
    const deanInfo = { 
        name: "Prof. Martin", 
        role: "Doyen",
        pendingSupports: 4 // Pour l'affichage dynamique
    };

    const renderContent = () => {
        switch (activeTab) {
            case TABS.DASHBOARD:
                return (
                    <div style={{ padding: '20px' }}>
                        <div style={styles.cardGrid}>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Supports en attente de Validation</h3>
                                <p style={styles.statValue} style={{color: '#f59e0b', fontWeight: 'bold'}}>{deanInfo.pendingSupports}</p>
                            </div>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Salles utilisées (Aujourd'hui)</h3>
                                <p style={styles.statValue}>12/15</p>
                            </div>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Cours non planifiés</h3>
                                <p style={styles.statValue}>0</p>
                            </div>
                        </div>
                    </div>
                );
            case TABS.VALIDATION:
                // 1. Accéder aux supports soumis
                // 2. Valider / Demander révision (géré dans le composant)
                return <SupportValidationQueue deanId={deanInfo.id} />;
            case TABS.COURS:
                // Consultation des EDTs globaux (pas de filtrage par ID)
                return <TimetableViewer type="cours" isDeanView={true} />; 
            case TABS.EXAMENS:
                // Consultation des EDTs d'examens globaux
                return <TimetableViewer type="examens" isDeanView={true} />;
            default:
                return null;
        }
    };

    // --- Styles (Réutilisés de manière harmonieuse) ---
    const styles = {
        mainLayout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f9' },
        sidebar: { width: '250px', backgroundColor: '#1f2937', color: 'white', padding: '20px 0', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' },
        logo: { fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px', color: '#4f46e5' },
        menuItem: { padding: '12px 20px', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', position: 'relative' },
        menuItemActive: { backgroundColor: '#4f46e5', borderLeft: '4px solid white' },
        pendingBadge: { position: 'absolute', right: '20px', backgroundColor: '#f59e0b', color: 'white', fontSize: '12px', padding: '2px 6px', borderRadius: '50%' },
        contentArea: { flexGrow: 1, padding: '30px' },
        header: { marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' },
        cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', padding: '20px 0' },
        statCard: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderLeft: '5px solid #4f46e5' },
        statTitle: { fontSize: '14px', color: '#6b7280', marginBottom: '8px' },
        statValue: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' },
    };

    const handleMouseEnter = (e) => e.currentTarget.style.backgroundColor = '#374151';
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
                        {/* Affichage dynamique du badge de validation en attente */}
                        {tab === TABS.VALIDATION && deanInfo.pendingSupports > 0 && (
                            <span style={styles.pendingBadge}>{deanInfo.pendingSupports}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Contenu Principal */}
            <div style={styles.contentArea}>
                <header style={styles.header}>
                    <h1 style={{ color: '#1f2937', fontSize: '24px' }}>Espace Doyen - {activeTab}</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>{deanInfo.role}: {deanInfo.name}</p>
                </header>
                
                {renderContent()}
            </div>
        </div>
    );
}

export default DeanDashboard;

