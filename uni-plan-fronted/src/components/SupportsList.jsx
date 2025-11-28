import React, { useEffect, useState } from 'react';

// Simule un appel d'API
const fetchSupports = async (level) => {
    // ... (Logique d'appel d'API et filtrage inchangés) ...
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: 1, title: "Introduction aux Microservices", matière: "Architecture Logicielle", enseignant: "M. Dubois", statut: "VALIDÉ" },
        { id: 2, title: "Algorithmes Avancés (TD)", matière: "Algorithmique", enseignant: "Mme. Lefevre", statut: "VALIDÉ" },
        { id: 4, title: "Réseaux et Sécurité (Chap. 1)", matière: "Réseaux", enseignant: "Mme. Kante", statut: "VALIDÉ" },
        { id: 5, title: "Analyse de Données", matière: "Statistiques", enseignant: "M. Dubois", statut: "VALIDÉ" },
    ].filter(s => s.statut === "VALIDÉ");
};

function SupportsList({ studentLevel }) {
    const [supports, setSupports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchSupports(studentLevel).then(data => {
            setSupports(data);
            setLoading(false);
        });
    }, [studentLevel]);

    const styles = {
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
        card: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderLeft: '5px solid #4f46e5' },
        title: { fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' },
        subtitle: { fontSize: '14px', color: '#6b7280', marginBottom: '15px' },
        button: { padding: '8px 15px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
    };

    if (loading) return <div>Chargement des supports...</div>;
    
    if (supports.length === 0) return <div>Aucun support validé disponible pour votre niveau ({studentLevel}) pour l'instant.</div>;

    return (
        <div>
            <h2>Supports Validés ({studentLevel})</h2>
            <div style={styles.grid}>
                {supports.map(support => (
                    <div key={support.id} style={styles.card}>
                        <p style={styles.title}>{support.title}</p>
                        <p style={styles.subtitle}>{support.matière} (Auteur: {support.enseignant})</p>
                        <a 
                            href={`/download/${support.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <button style={styles.button}>Télécharger le Support ⬇️</button>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SupportsList;

