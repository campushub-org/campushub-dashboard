// src/pages/TeacherDashboard.jsx
import React, { useState } from 'react';
import SupportSubmissionForm from '../components/SupportSubmissionForm';
import TimetableViewer from '../components/TimetableViewer'; 
import NotificationCenter from '../components/NotificationCenter'; // NOUVEAU
import AvailabilityForm from '../components/AvailabilityForm';     // NOUVEAU

const TABS = {
    DASHBOARD: 'Tableau de Bord',
    DEPOSIT: 'Déposer un support',
    NOTIFICATIONS: 'Notifications & Publications', // 2 & 3. Regroupe notifications et action de publication
    AVAILABILITY: 'Mes disponibilités',          // 4. Remplir heures
    COURS: "Emploi du temps des cours",          // 5. Consultation EDTs
    EXAMENS: "Emploi du temps des examens",      // 5. Consultation EDTs
};

function TeacherDashboard() {
    const [activeTab, setActiveTab] = useState(TABS.DEPOSIT);
    
    const teacherInfo = { 
        id: 456, 
        name: "M. Dubois", 
        department: "Informatique",
        assignedMatieres: ["Architecture Logicielle", "Algorithmique", "Réseaux"],
        // Simule les notifications non lues pour l'affichage du badge
        unreadNotifications: 3 
    };

    const renderContent = () => {
        switch (activeTab) {
            case TABS.DASHBOARD:
                return (
                    <div style={{ padding: '20px' }}>
                        <div style={styles.cardGrid}>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Supports en Attente (Soumis)</h3>
                                <p style={styles.statValue}>2</p>
                            </div>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Notifications non lues</h3>
                                <p style={styles.statValue} style={{color: '#ef4444', fontWeight: 'bold'}}>{teacherInfo.unreadNotifications}</p>
                            </div>
                            <div style={styles.statCard}>
                                <h3 style={styles.statTitle}>Matières Assignées</h3>
                                <p style={styles.statValue}>{teacherInfo.assignedMatieres.length}</p>
                            </div>
                        </div>
                    </div>
                );
            case TABS.DEPOSIT:
                // 1. Soumettre un ou plusieurs support de cours
                return <SupportSubmissionForm teacherId={teacherInfo.id} matieres={teacherInfo.assignedMatieres} />;
            case TABS.NOTIFICATIONS:
                // 2. Checker les notifications / 3. Publier un support
                return <NotificationCenter teacherId={teacherInfo.id} />;
            case TABS.AVAILABILITY:
                // 4. Remplir ses heures de disponibilité
                return <AvailabilityForm teacherId={teacherInfo.id} />;
            case TABS.COURS:
                // 5. Consultation EDT (Cours)
                return <TimetableViewer type="cours" teacherId={teacherInfo.id} />;
            case TABS.EXAMENS:
                 // 5. Consultation EDT (Examens)
                return <TimetableViewer type="examens" teacherId={teacherInfo.id} />;
            default:
                return null;
        }
    };

    // --- Styles Harmonieux (inspirés de l'image) ---
    const styles = {
        mainLayout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f9' },
        sidebar: { width: '250px', backgroundColor: '#1f2937', color: 'white', padding: '20px 0', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' },
        logo: { fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px', color: '#4f46e5' },
        menuItem: { padding: '12px 20px', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', position: 'relative' },
        menuItemActive: { backgroundColor: '#4f46e5', borderLeft: '4px solid white' },
        notificationBadge: { position: 'absolute', right: '20px', backgroundColor: '#ef4444', color: 'white', fontSize: '12px', padding: '2px 6px', borderRadius: '50%' }, // Élément de dynamisme
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
                        {/* Affichage dynamique du badge de notification */}
                        {tab === TABS.NOTIFICATIONS && teacherInfo.unreadNotifications > 0 && (
                            <span style={styles.notificationBadge}>{teacherInfo.unreadNotifications}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Contenu Principal */}
            <div style={styles.contentArea}>
                <header style={styles.header}>
                    <h1 style={{ color: '#1f2937', fontSize: '24px' }}>Espace Enseignant - {activeTab}</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Département: {teacherInfo.department}</p>
                </header>
                
                {renderContent()}
            </div>
        </div>
    );
}

export default TeacherDashboard;

