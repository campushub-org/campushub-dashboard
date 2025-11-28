// src/components/AdminControls.jsx
import React, { useState, useEffect } from 'react';

// Simule la liste des utilisateurs du Auth/User Service
const fetchUsers = async () => {
    console.log("[API Call] Récupération de la liste des utilisateurs (enseignants et étudiants).");
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: 1, nom: "Dupont", prenom: "Léa", email: "lea.dupont@uni.fr", role: "ÉTUDIANT", niveau: "L3-INFO" },
        { id: 456, nom: "Dubois", prenom: "Marc", email: "m.dubois@uni.fr", role: "ENSEIGNANT", disponibilité: true },
        { id: 2, nom: "Martin", prenom: "Hugo", email: "hugo.martin@uni.fr", role: "ÉTUDIANT", niveau: "M1-INFO" },
        { id: 701, nom: "Lemaire", prenom: "Sophie", email: "s.lemaire@uni.fr", role: "ENSEIGNANT", disponibilité: false },
        { id: 702, nom: "Kanté", prenom: "Amine", email: "a.kante@uni.fr", role: "ENSEIGNANT", disponibilité: true },
    ];
};

// Simule la vérification du Scheduling Service
const checkAvailabilityStatus = async (users) => {
    // La logique doit vérifier combien d'enseignants n'ont pas encore rempli leurs disponibilités.
    const teachers = users.filter(u => u.role === 'ENSEIGNANT');
    const unavailableCount = teachers.filter(t => t.disponibilité === false).length;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { 
        isReady: unavailableCount === 0,
        unavailableCount: unavailableCount,
        totalTeachers: teachers.length
    };
};

function AdminControls({ type }) {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [planningStatus, setPlanningStatus] = useState({ isReady: false, unavailableCount: 0, totalTeachers: 0 });
    const [generationLoading, setGenerationLoading] = useState(false);

    // Chargement initial des données
    useEffect(() => {
        if (type === 'users' || type === 'generation') {
            setLoading(true);
            fetchUsers().then(data => {
                setUsers(data);
                if (type === 'generation') {
                    checkAvailabilityStatus(data).then(status => {
                        setPlanningStatus(status);
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }
            });
        }
    }, [type]);


    // --- Logique de Gestion Utilisateur ---
    
    const handleDelete = async (userId, userName) => {
        // 1. Suppression (l'utilisateur supprimé verra son compte supprimé de la bd)
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} (ID: ${userId}) ? Cette action est irréversible (suppression de la BD).`)) {
            return;
        }

        console.log(`[API Call] DELETE /api/v1/users/${userId}`);
        // En réalité: Appel API au Auth/User Service (DELETE /api/v1/users/{id})

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800)); 
        setUsers(prev => prev.filter(u => u.id !== userId));
        setLoading(false);
        alert(`L'utilisateur ${userName} a été supprimé du système.`);
    };

    const filteredUsers = users.filter(user => 
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Logique de Génération EDT ---

    const handleGenerateTimetable = async () => {
        setGenerationLoading(true);
        console.log("[API Call] POST /api/v1/scheduling/run");
        
        // En réalité: Appel API au Scheduling Service (POST /scheduling/run)
        await new Promise(resolve => setTimeout(resolve, 3000)); // La planification peut être longue
        
        setGenerationLoading(false);
        alert("Génération des Emplois du Temps terminée. Veuillez consulter les tableaux pour vérifier les résultats.");
        // Le Scheduling Service doit notifier le Notifications Service pour informer les utilisateurs
    };

    // --- Styles ---
    const styles = {
        container: { padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
        title: { fontSize: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' },
        input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', marginBottom: '20px' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f9fafb', textAlign: 'left', color: '#1f2937' },
        td: { padding: '12px', borderBottom: '1px solid #eee' },
        deleteButton: { padding: '6px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        // Styles de Planification
        planningCard: { padding: '20px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '20px' },
        planningReady: { backgroundColor: '#e0f7e9', color: '#10b981' }, // Vert
        planningPending: { backgroundColor: '#fff7e6', color: '#f59e0b' }, // Jaune
        generateButton: { padding: '12px 25px', backgroundColor: '#03a9f4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: generationLoading ? 0.7 : 1 },
        disabledButton: { backgroundColor: '#6b7280', cursor: 'not-allowed' }
    };

    if (loading) return <div style={styles.container}>Chargement des données d'administration...</div>;

    // --- Rendu 1 : Gestion Utilisateurs ---
    if (type === 'users') {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>1. Liste Exhaustive des Utilisateurs</h2>
                
                <input
                    type="text"
                    placeholder="Rechercher par nom, prénom ou email..."
                    style={styles.input}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Nom & Prénom</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Rôle</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td style={styles.td}>{user.id}</td>
                                <td style={styles.td}>{user.prenom} {user.nom}</td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>
                                    <strong style={{ color: user.role === 'ENSEIGNANT' ? '#4f46e5' : '#10b981' }}>{user.role}</strong>
                                </td>
                                <td style={styles.td}>
                                    <button 
                                        style={styles.deleteButton}
                                        onClick={() => handleDelete(user.id, `${user.prenom} ${user.nom}`)}
                                        disabled={loading}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>Aucun utilisateur trouvé.</p>}
            </div>
        );
    }

    // --- Rendu 2 : Génération EDT ---
    if (type === 'generation') {
        const statusStyle = planningStatus.isReady ? styles.planningReady : styles.planningPending;
        
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>2. Génération de l'Emploi du Temps (Cours & Examens)</h2>

                <div style={{ ...styles.planningCard, ...statusStyle }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Statut de Préparation à la Planification</h3>
                    
                    {/* Affichage du statut de la condition clé */}
                    {planningStatus.isReady ? (
                        <p style={{ fontWeight: 'bold' }}>
                            ✅ Intégrité des données vérifiée : Tous les {planningStatus.totalTeachers} enseignants ont fourni leurs disponibilités.
                        </p>
                    ) : (
                        <p style={{ fontWeight: 'bold', color: styles.planningPending.color }}>
                            ⚠️ Planification impossible : Il manque les heures de disponibilité de {planningStatus.unavailableCount} enseignant(s) sur {planningStatus.totalTeachers}.
                        </p>
                    )}
                </div>

                <p style={{ marginBottom: '30px', color: '#6b7280' }}>
                    Le bouton ci-dessous n'est actif que lorsque l'intégralité des professeurs répertoriés ont soumis leurs heures de disponibilité.
                </p>

                <button
                    style={{ ...styles.generateButton, ...(!planningStatus.isReady && styles.disabledButton) }}
                    onClick={handleGenerateTimetable}
                    disabled={!planningStatus.isReady || generationLoading}
                >
                    {generationLoading 
                        ? 'Planification en Cours...' 
                        : planningStatus.isReady 
                        ? '▶️ Lancer la Génération des EDTs' 
                        : 'Planification Non Disponible'}
                </button>
            </div>
            );
    }

    return null;
}

export default AdminControls;

