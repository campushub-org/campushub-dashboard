// src/components/TimetableViewer.jsx
import React, { useEffect, useState } from 'react';

// Simule un appel d'API
const fetchTimetable = async (type, level) => {
    // ... (Logique d'appel d'API et données mockées inchangées) ...
    await new Promise(resolve => setTimeout(resolve, 500));
    if (type === "cours") {
        return [
            { jour: 'Lundi', heure: '08h00 - 10h00', matiere: 'Algorithmique', salle: 'A-201', type: 'CM' },
            { jour: 'Mardi', heure: '14h00 - 16h00', matiere: 'Réseaux', salle: 'B-105', type: 'TD' },
            { jour: 'Jeudi', heure: '10h00 - 12h00', matiere: 'Architecture Logicielle', salle: 'Amphi 3', type: 'CM' },
        ];
    } else {
        return [
            { date: '2025-12-10', heure: '09h00 - 11h00', matiere: 'Architecture Logicielle', salle: 'Grand Amphi', type: 'CC' },
            { date: '2025-01-05', heure: '13h30 - 16h30', matiere: 'Algorithmique', salle: 'C-002', type: 'SN' },
        ];
    }
};

function TimetableViewer({ type, studentLevel }) {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchTimetable(type, studentLevel).then(data => {
            setTimetable(data);
            setLoading(false);
        });
    }, [type, studentLevel]);

    const styles = {
        tableContainer: { backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f9fafb', textAlign: 'left', color: '#1f2937' },
        td: { padding: '12px', borderBottom: '1px solid #eee' },
        trEven: { backgroundColor: '#fefefe' },
        trOdd: { backgroundColor: '#fff' },
        typeCM: { color: '#4f46e5', fontWeight: 'bold' },
        typeTDTP: { color: '#10b981', fontWeight: 'bold' },
        typeExam: { color: '#ef4444', fontWeight: 'bold' }
    };

    if (loading) return <div>Chargement de l'emploi du temps des {type}...</div>;
    
    if (timetable.length === 0) return <div>Aucun emploi du temps ({type}) disponible pour l'instant.</div>;

    const isExam = type === "examens";
    
    const getTypeStyle = (itemType) => {
        if (isExam) return styles.typeExam;
        if (itemType === 'CM') return styles.typeCM;
        return styles.typeTDTP;
    };

    return (
        <div>
            <h2>Emploi du Temps des {isExam ? 'Examens' : 'Cours'}</h2>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>{isExam ? 'Date' : 'Jour'}</th>
                            <th style={styles.th}>Heure</th>
                            <th style={styles.th}>Matière</th>
                            <th style={styles.th}>Salle</th>
                            <th style={styles.th}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetable.map((item, index) => (
                            <tr key={index} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                                <td style={styles.td}>{isExam ? item.date : item.jour}</td>
                                <td style={styles.td}>{item.heure}</td>
                                <td style={styles.td}>{item.matiere}</td>
                                <td style={styles.td}>{item.salle}</td>
                                <td style={{...styles.td, ...getTypeStyle(item.type)}}>{item.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TimetableViewer;

