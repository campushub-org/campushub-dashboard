// src/components/NotificationCenter.jsx
import React, { useState, useEffect } from 'react';

// Simule les notifications reçues du Workflow Service
const fetchNotifications = async (teacherId) => {
    console.log(`[API Call] Récupération des notifications pour Enseignant ID: ${teacherId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: 1, type: "VALIDATION", matiere: "Algorithmique", supportId: 102, title: "TD S3 Algorithmique", date: "2025-11-26", status: "Validé, prêt à publier" },
        { id: 2, type: "REVISION", matiere: "Architecture Log.", supportId: 101, title: "Chapitre 1", date: "2025-11-25", status: "Rejeté, veuillez ajouter plus d'exemples pratiques.", doyen: "Prof. Martin" },
        { id: 3, type: "INFO", matiere: "Général", date: "2025-11-24", status: "Le calendrier des examens CC est finalisé." },
    ];
};

function NotificationCenter({ teacherId }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchNotifications(teacherId).then(data => {
            setNotifications(data);
            setLoading(false);
        });
    }, [teacherId]);

    const handlePublish = (supportId, title) => {
        // 3. Publier un support de cours (une fois validé)
        console.log(`[API Call] Publication du support ID ${supportId}`);
        alert(`Le support "${title}" est maintenant publié et visible par les étudiants.`);
        // En réalité: Appel API au Support Service (POST /supports/{id}/publish)
        
        // Mettre à jour l'état local après publication
        setNotifications(prev => prev.filter(n => !(n.id === supportId && n.type === "VALIDATION")));
    };
    
    const styles = {
        list: { padding: 0, listStyleType: 'none' },
        card: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '15px', borderLeft: '4px solid', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        revisionBorder: { borderColor: '#f59e0b' },
        validationBorder: { borderColor: '#10b981' },
        infoBorder: { borderColor: '#4f46e5' },
        button: { padding: '8px 15px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' },
        rejectButton: { backgroundColor: '#f59e0b' }
    };

    if (loading) return <div>Chargement des notifications...</div>;

    if (notifications.length === 0) return <div>Vous n'avez aucune nouvelle notification.</div>;

    return (
        <div>
            <h2>Mes Notifications et Actions Requises</h2>
            <ul style={styles.list}>
                {notifications.map(n => {
                    const borderStyle = n.type === "REVISION" ? styles.revisionBorder : (n.type === "VALIDATION" ? styles.validationBorder : styles.infoBorder);
                    const actionRequired = n.type === "VALIDATION" || n.type === "REVISION";

                    return (
                        <li key={n.id} style={{ ...styles.card, ...borderStyle }}>
                            <div>
                                <strong style={{ color: borderStyle.borderColor }}>[{n.type}]</strong> {n.title} ({n.matiere})
                                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
                                    {n.status} {n.doyen && `(Par ${n.doyen})`}
                                </p>
                            </div>
                            {actionRequired && (
                                <div>
                                    {n.type === "VALIDATION" && (
                                        <button 
                                            style={styles.button}
                                            onClick={() => handlePublish(n.supportId, n.title)}
                                        >
                                            Publier Maintenant
                                        </button>
                                    )}
                                    {n.type === "REVISION" && (
                                        <button 
                                            style={{...styles.button, ...styles.rejectButton}}
                                            onClick={() => alert(`Redirection vers la correction du support ID ${n.supportId}`)}
                                        >
                                            Voir la Correction
                                        </button>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default NotificationCenter;

