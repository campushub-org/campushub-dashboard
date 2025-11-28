

// src/components/TimetableViewer.jsx
import React, { useEffect, useState } from 'react';

// Simule un appel d'API au Backend (Scheduling Service ou Examens Service)
// Ce composant doit être agnostique et utiliser soit studentLevel, soit teacherId
const fetchTimetable = async (type, identifier, isTeacher) => {
    const identifiantType = isTeacher ? 'Enseignant ID' : 'Niveau';
    console.log(`[API Call] Récupération de l'EDT type: ${type} pour ${identifiantType}: ${identifier}`);
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simule le délai API

    if (type === "cours") {
        if (isTeacher) {
            // DONNÉES MOCKÉES : Cours de l'enseignant
            return [
                { jour: 'Lundi', heure: '08h00 - 10h00', matiere: 'Architecture Logicielle', niveau: 'L3-INFO', salle: 'Amphi 3', type: 'CM' },
                { jour: 'Jeudi', heure: '14h00 - 16h00', matiere: 'Algorithmique', niveau: 'L2-INFO', salle: 'B-105', type: 'TD' },
                { jour: 'Vendredi', heure: '10h00 - 12h00', matiere: 'Architecture Logicielle', niveau: 'M1-INFO', salle: 'A-201', type: 'TP' },
            ];
        } else {
            // DONNÉES MOCKÉES : Cours de l'étudiant
            return [
                { jour: 'Lundi', heure: '08h00 - 10h00', matiere: 'Algorithmique', salle: 'A-201', type: 'CM' },
                { jour: 'Mardi', heure: '14h00 - 16h00', matiere: 'Réseaux', salle: 'B-105', type: 'TD' },
            ];
        }
    } else { // type === "examens"
        if (isTeacher) {
            // DONNÉES MOCKÉES : Surveillances ou examens de l'enseignant
            return [
                { date: '2025-12-10', heure: '09h00 - 11h00', matiere: 'Bases de Données', niveau: 'L3-INFO', salle: 'Grand Amphi', role: 'Surveillance', type: 'CC' },
                { date: '2025-01-05', heure: '13h30 - 16h30', matiere: 'Algorithmique', niveau: 'L2-INFO', salle: 'C-002', role: 'Enseignant', type: 'SN' },
                { date: '2025-01-08', heure: '08h00 - 10h00', matiere: 'Réseaux', niveau: 'L3-INFO', salle: 'D-301', role: 'Surveillance', type: 'CC' },
            ];
        } else {
             // DONNÉES MOCKÉES : Examens de l'étudiant
            return [
                { date: '2025-12-10', heure: '09h00 - 11h00', matiere: 'Architecture Logicielle', salle: 'Grand Amphi', type: 'CC' },
                { date: '2025-01-05', heure: '13h30 - 16h30', matiere: 'Algorithmique', salle: 'C-002', type: 'SN' },
            ];
        }
    }
};

function TimetableViewer({ type, studentLevel, teacherId }) {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);

    // Détermine l'identifiant à utiliser (teacherId est prioritaire)
    const identifier = teacherId || studentLevel;
    const isTeacherView = !!teacherId;

    useEffect(() => {
        setLoading(true);
        if (identifier) {
            fetchTimetable(type, identifier, isTeacherView).then(data => {
                setTimetable(data);
                setLoading(false);
            });
        }
    }, [type, identifier, isTeacherView]);

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
    
    if (timetable.length === 0) return <div>Aucun emploi du temps ({type}) disponible pour cet identifiant.</div>;

    const isExam = type === "examens";
    
    const getTypeStyle = (itemType) => {
        if (isExam) return styles.typeExam;
        if (itemType === 'CM') return styles.typeCM;
        return styles.typeTDTP;
    };

    // Détermine les en-têtes de colonnes en fonction de l'utilisateur
    let headers = isExam 
        ? ['Date', 'Heure', 'Matière', 'Salle', 'Type']
        : ['Jour', 'Heure', 'Matière', 'Salle', 'Type'];
        
    if (isTeacherView) {
        // L'enseignant a besoin du niveau pour ses cours/surveillances et du rôle pour les examens
        headers.splice(3, 0, 'Niveau'); 
        if (isExam) {
            headers.push('Rôle');
        }
    }

    const displayTitle = isTeacherView 
        ? `Mes ${type === 'cours' ? 'Cours & TD' : 'Surveillances & Examens'}`
        : `Emploi du Temps des ${type}`;


    return (
        <div>
            <h2>{displayTitle}</h2>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            {headers.map(header => <th key={header} style={styles.th}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {timetable.map((item, index) => (
                            <tr key={index} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                                {/* Colonne Date / Jour */}
                                <td style={styles.td}>{isExam ? item.date : item.jour}</td> 
                                {/* Colonne Heure */}
                                <td style={styles.td}>{item.heure}</td>
                                {/* Colonne Matière */}
                                <td style={styles.td}>{item.matiere}</td>
                                {/* Colonne Niveau (pour l'enseignant) */}
                                {isTeacherView && <td style={styles.td}>{item.niveau || '-'}</td>} 
                                {/* Colonne Salle */}
                                <td style={styles.td}>{item.salle}</td>
                                {/* Colonne Type (CM/TD/CC/SN) */}
                                <td style={{...styles.td, ...getTypeStyle(item.type)}}>{item.type}</td>
                                {/* Colonne Rôle (uniquement pour les examens de l'enseignant) */}
                                {isTeacherView && isExam && <td style={styles.td}>{item.role}</td>} 
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TimetableViewer;
