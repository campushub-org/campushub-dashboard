// src/components/SupportSubmissionForm.jsx
import React, { useState, useEffect } from 'react';

// Simule la récupération des supports déjà soumis pour le suivi (GET /supports/enseignant/{id})
const fetchSubmittedSupports = async (teacherId) => {
    console.log(`[API Call] Récupération des supports soumis par l'enseignant ID: ${teacherId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
        { id: 101, title: "Chapitre 1: Introduction", matiere: "Architecture Logicielle", dateDepot: "2025-11-20", statut: "VALIDÉ" },
        { id: 102, title: "Travaux Dirigés S3", matiere: "Algorithmique", dateDepot: "2025-11-25", statut: "SOUMIS" },
        { id: 103, title: "Rapport de TP", matiere: "Réseaux", dateDepot: "2025-11-01", statut: "REJETÉ", remarque: "Format incorrect" },
    ];
};

function SupportSubmissionForm({ teacherId, matieres }) {
    const [title, setTitle] = useState('');
    const [matiere, setMatiere] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [submittedSupports, setSubmittedSupports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setLoading(true);
        fetchSubmittedSupports(teacherId).then(data => {
            setSubmittedSupports(data);
            setLoading(false);
        });
    }, [teacherId]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        // Contrainte: Support de multiples formats (PDF, PPT, DOCX)
        if (
            selectedFile &&
            [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ].includes(selectedFile.type)
        ) {
            setFile(selectedFile);
        } else {
            alert("Veuillez sélectionner un fichier PDF, PPTX ou DOCX.");
            setFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !matiere || !file) {
            setMessage("Veuillez remplir tous les champs obligatoires (Titre, Matière, Fichier).");
            return;
        }

        setLoading(true);
        setMessage("Soumission en cours...");

        const supportData = {
            idEnseignant: teacherId,
            title,
            description,
            matiere,
            fichierUrl: `mocked_url_${Date.now()}` 
        };

        await new Promise(resolve => setTimeout(resolve, 1500));

        setMessage(`Support "${title}" soumis avec succès ! Il est en attente de validation.`);
        setLoading(false);

        setSubmittedSupports(prev => [
            ...prev,
            {
                id: Date.now(),
                title,
                matiere,
                dateDepot: new Date().toISOString().split('T')[0],
                statut: "SOUMIS"
            }
        ]);

        setTitle('');
        setMatiere('');
        setDescription('');
        setFile(null);
    };

    const getStatusStyle = (statut) => {
        if (statut === "VALIDÉ") return { color: '#10b981', fontWeight: 'bold' };
        if (statut === "REJETÉ") return { color: '#ef4444', fontWeight: 'bold' };
        return { color: '#f59e0b', fontWeight: 'bold' }; 
    };

    const styles = {
        formContainer: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' },
        formTitle: { fontSize: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' },
        formGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' },
        input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
        select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
        button: { padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: loading ? 0.7 : 1 },
        message: { padding: '10px', borderRadius: '4px', backgroundColor: '#eef2ff', color: '#4f46e5', marginBottom: '20px' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
        th: { borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f9fafb', textAlign: 'left', color: '#1f2937' },
        td: { padding: '12px', borderBottom: '1px solid #eee' },
    };

    return (
        <div>
            <h1 style={styles.formTitle}>Déposer un Nouveau Support de Cours</h1>

            {message && <div style={styles.message}>{message}</div>}

            <form onSubmit={handleSubmit} style={styles.formContainer}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Matière (obligatoire)</label>
                    <select
                        style={styles.select}
                        value={matiere}
                        onChange={(e) => setMatiere(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Sélectionnez une matière</option>
                        {matieres.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Titre du Support (obligatoire)</label>
                    <input
                        type="text"
                        style={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Description (optionnel)</label>
                    <textarea
                        style={{ ...styles.input, height: '80px' }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Fichier (PDF, PPTX, DOCX)</label>
                    <input
                        type="file"
                        accept=".pdf,.pptx,.docx"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    {file && (
                        <p style={{ marginTop: '5px', fontSize: '12px', color: '#10b981' }}>
                            Fichier sélectionné : {file.name}
                        </p>
                    )}
                </div>

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Soumission...' : 'Déposer le Support'}
                </button>
            </form>

            {/* Suivi des Supports Déposés */}
            <h2 style={{ ...styles.sectionTitle, marginTop: '40px' }}>Statut de mes Supports Déposés</h2>

            {loading ? (
                <div>Chargement du statut...</div>
            ) : submittedSupports.length > 0 ? (
                <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Titre</th>
                                <th style={styles.th}>Matière</th>
                                <th style={styles.th}>Date de Dépôt</th>
                                <th style={styles.th}>Statut</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submittedSupports.map(s => (
                                <tr key={s.id}>
                                    <td style={styles.td}>{s.title}</td>
                                    <td style={styles.td}>{s.matiere}</td>
                                    <td style={styles.td}>{s.dateDepot}</td>
                                    <td style={{ ...styles.td, ...getStatusStyle(s.statut) }}>{s.statut}</td>
                                    <td style={styles.td}>
                                        {s.statut === "REJETÉ" && (
                                            <button style={{ ...styles.button, backgroundColor: '#f59e0b', marginRight: '5px' }}>
                                                Corriger
                                            </button>
                                        )}
                                        {s.statut !== "VALIDÉ" && (
                                            <button style={{ ...styles.button, backgroundColor: '#6b7280' }}>
                                                Retirer
                                            </button>
                                        )}
                                        {s.statut === "VALIDÉ" && <span style={{ color: '#6b7280' }}>Publié</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p style={{ padding: '10px 20px', fontSize: '14px', color: '#ef4444' }}>
                        *Si le statut est REJETÉ, la remarque du doyen est affichée ici.
                    </p>
                </div>
            ) : (
                <div>Aucun support déposé pour l'instant.</div>
            )}
        </div>
    );
}

export default SupportSubmissionForm;

