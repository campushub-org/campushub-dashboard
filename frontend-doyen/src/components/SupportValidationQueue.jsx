// src/components/SupportValidationQueue.jsx
import React, { useState, useEffect } from 'react';

// Simule la file d'attente des supports soumis (Statut "SOUMIS")
const fetchSupportsToValidate = async () => {
    console.log("[API Call] Récupération des supports en attente de validation.");
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: 105, title: "Introduction aux Big Data", matiere: "Big Data", enseignantId: 701, enseignantNom: "Dr. Lemaire", dateDepot: "2025-11-26", fichierUrl: "/mock_downloads/support_105.pdf" },
        { id: 106, title: "Architecture Microservices Avancée", matiere: "Architecture Log.", enseignantId: 456, enseignantNom: "M. Dubois", dateDepot: "2025-11-25", fichierUrl: "/mock_downloads/support_106.pdf" },
        { id: 107, title: "Introduction à la Cryptographie", matiere: "Sécurité", enseignantId: 702, enseignantNom: "Mme. Kanté", dateDepot: "2025-11-24", fichierUrl: "/mock_downloads/support_107.pdf" },
    ];
};

function SupportValidationQueue({ deanId }) {
    const [supports, setSupports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSupport, setSelectedSupport] = useState(null);
    const [revisionComment, setRevisionComment] = useState('');
    const [decisionLoading, setDecisionLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchSupportsToValidate().then(data => {
            setSupports(data);
            setLoading(false);
        });
    }, [deanId]);

    const openRevisionModal = (support) => {
        setSelectedSupport(support);
        setModalOpen(true);
        setRevisionComment('');
    };

    const handleDecision = async (decision) => {
        if (!selectedSupport) return;
        
        // Validation spécifique pour la révision
        if (decision === 'REVISE' && !revisionComment.trim()) {
            alert("Veuillez fournir un commentaire pour justifier la demande de révision.");
            return;
        }

        setDecisionLoading(true);

        // ----------------------------------------------------------------------
        // SIMULATION DU FLUX MICROSERVICES :
        // ----------------------------------------------------------------------
        
        // 1. Appel API au Support Service (ou Workflow) pour changer le statut
        // Ex: axios.post(`/api/v1/supports/${selectedSupport.id}/status`, { statut: decision === 'VALIDATE' ? 'VALIDÉ' : 'REJETÉ', commentaireDoyen: revisionComment });
        
        // 2. Appel API au Notifications Service pour informer l'enseignant
        // Ex: axios.post('/api/v1/notifications', { enseignantId: selectedSupport.enseignantId, message: `Votre support "${selectedSupport.title}" a été ${decision === 'VALIDATE' ? 'VALIDÉ' : 'REJETÉ'}...` });
        
        console.log(`[API Call] Décision: ${decision} pour support ID ${selectedSupport.id}. Commentaire: ${revisionComment || 'N/A'}`);
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        setDecisionLoading(false);
        setModalOpen(false);

        // Mettre à jour l'état local (retirer le support de la queue)
        setSupports(prev => prev.filter(s => s.id !== selectedSupport.id));

        alert(`Action '${decision === 'VALIDATE' ? 'VALIDATION' : 'RÉVISION'}' effectuée. L'enseignant a été notifié.`);
        setSelectedSupport(null);
    };

    // --- Styles ---
    const styles = {
        table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
        th: { borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f9fafb', textAlign: 'left', color: '#1f2937' },
        td: { padding: '12px', borderBottom: '1px solid #eee' },
        link: { color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold' },
        validateButton: { padding: '8px 15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
        reviseButton: { padding: '8px 15px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        
        // Modal Styles
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
        modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' },
        textarea: { width: '100%', minHeight: '100px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '10px', marginBottom: '15px' },
        modalButton: (color) => ({ padding: '10px 15px', backgroundColor: color, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: decisionLoading ? 0.7 : 1, marginRight: '10px' }),
        titleDownload: { display: 'flex', alignItems: 'center', gap: '5px' },
    };

    if (loading) return <div>Chargement des supports en attente...</div>;

    if (supports.length === 0) return <div style={{padding: '20px', backgroundColor: 'white', borderRadius: '8px'}}>Aucun support en attente de validation.</div>;

    return (
        <div>
            <h2>Supports soumis en attente de Revue ({supports.length})</h2>
            <p style={{color: '#6b7280', marginBottom: '20px'}}>
                Cliquez sur le titre pour parcourir le document.
            </p>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Titre du support</th>
                        <th style={styles.th}>Matière</th>
                        <th style={styles.th}>Enseignant auteur</th>
                        <th style={styles.th}>Date de dépôt</th>
                        <th style={styles.th}>Décision</th>
                    </tr>
                </thead>
                <tbody>
                    {supports.map(s => (
                        <tr key={s.id}>
                            <td style={styles.td}>
                                {/* Accès au document PDF pour le parcourir/télécharger */}
                                <a 
                                    href={s.fichierUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={styles.link}
                                >
                                    <div style={styles.titleDownload}>{s.title} 📥</div>
                                </a>
                            </td>
                            <td style={styles.td}>{s.matiere}</td>
                            <td style={styles.td}>{s.enseignantNom}</td>
                            <td style={styles.td}>{s.dateDepot}</td>
                            <td style={styles.td}>
                                {/* Possibilité d'envoyer notification (Valider ou Réviser) */}
                                <button 
                                    style={styles.validateButton}
                                    onClick={() => { setSelectedSupport(s); handleDecision('VALIDATE'); }}
                                    disabled={decisionLoading}
                                >
                                    ✅ Valider 
                                </button>
                                <button 
                                    style={styles.reviseButton}
                                    onClick={() => openRevisionModal(s)}
                                    disabled={decisionLoading}
                                >
                                    ✏️ À réviser
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de Révision (avec commentaire) */}
            {modalOpen && selectedSupport && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3>Demander une Révision pour "{selectedSupport.title}"</h3>
                        <p style={{color: '#6b7280'}}>
                            Entrez le commentaire de justification que l'enseignant ({selectedSupport.enseignantNom}) recevra par notification.
                        </p>
                        <textarea
                            style={styles.textarea}
                            value={revisionComment}
                            onChange={(e) => setRevisionComment(e.target.value)}
                            placeholder="Ex: Le chapitre 3 manque de références à jour. Veuillez ajouter une section sur les algorithmes parallèles."
                            disabled={decisionLoading}
                        />
                        <button 
                            style={styles.modalButton('#f59e0b')} 
                            onClick={() => handleDecision('REVISE')}
                            disabled={decisionLoading || !revisionComment.trim()}
                        >
                            {decisionLoading ? 'Envoi...' : 'Envoyer la Révision'}
                        </button>
                        <button style={styles.modalButton('#6b7280')} onClick={() => setModalOpen(false)} disabled={decisionLoading}>
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SupportValidationQueue;

