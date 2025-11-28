import React from "react";

const TimetableViewer = ({ data = [], type, isDeanView, isTeacherView }) => {

    // --- TITRE DYNAMIQUE CORRIGÉ ---
    const displayTitle = isDeanView 
        ? `Vue Globale des ${type === 'cours' ? 'Cours & TD/TP' : 'Examens (CC/SN)'}`
        : isTeacherView 
        ? `Mes ${type === 'cours' ? 'Cours & TD' : 'Surveillances & Examens'}`
        : `Emploi du Temps des ${type}`;

    // --- STYLES SIMPLES ---
    const styles = {
        container: { padding: "20px" },
        title: { fontSize: "22px", fontWeight: "bold", marginBottom: "20px" },
        table: { width: "100%", borderCollapse: "collapse" },
        th: { background: "#f0f0f0", padding: "10px", border: "1px solid #ddd" },
        td: { padding: "8px", border: "1px solid #ddd" },
        row: { background: "#fff" }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{displayTitle}</h2>

            {data.length === 0 ? (
                <p>Aucune donnée disponible pour le moment.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Jour</th>
                            <th style={styles.th}>Heure</th>
                            <th style={styles.th}>Salle</th>
                            <th style={styles.th}>Matière</th>
                            <th style={styles.th}>Enseignant</th>
                            <th style={styles.th}>Niveau</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} style={styles.row}>
                                <td style={styles.td}>{item.jour || "-"}</td>
                                <td style={styles.td}>{item.heure || "-"}</td>
                                <td style={styles.td}>{item.salle || "-"}</td>
                                <td style={styles.td}>{item.matiere || "-"}</td>
                                <td style={styles.td}>{item.enseignant || "-"}</td>

                                {/* CORRECTION IMPORTANTE : item.niveau || '-' */}
                                <td style={styles.td}>{item.niveau || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TimetableViewer;

