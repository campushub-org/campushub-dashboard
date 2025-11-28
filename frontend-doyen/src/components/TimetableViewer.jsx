// src/components/TimetableViewer.jsx
import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Utiliser Axios en production, Mock en développement

// Simule un appel d'API au Backend (Scheduling Service ou Examens Service)
const fetchTimetable = async (type, identifier, isTeacher, isDeanView) => {
    // ----------------------------------------------------------------------
    // NOTE TECHNIQUE : En production, ce bloc ferait un appel conditionnel
    // d'API vers les microservices appropriés (ex: Scheduling Service).
    // Ex: axios.get(`/api/v1/scheduling/timetables/${isDeanView ? 'global' : (isTeacher ? 'teacher' : 'student')}/${identifier || ''}`);
    // ----------------------------------------------------------------------
    
    await new Promise(resolve => setTimeout(resolve, 500)); 

    // --- LOGIQUE DE MOCK ---

    if (type === "cours") {
        if (isDeanView) {
            // VUE DOYEN (Globale des cours)
            return [
                { jour: 'Lundi', heure: '08h00 - 10h00', matiere: 'Architecture Log.', niveau: 'L3-INFO', enseignant: 'M. Dubois', salle: 'Amphi 3', type: 'CM' },
                { jour: 'Mardi', heure: '14h00 - 16h00', matiere: 'Réseaux', niveau: 'L2-INFO', enseignant: 'Mme. Lefevre', salle: 'B-105', type: 'TD' },
                { jour: 'Jeudi', heure: '10h00 - 12h00', matiere: 'Big Data', niveau: 'M1-INFO', enseignant: 'Dr. Lemaire', salle: 'C-001', type: 'CM' },
            ];
        } else if (isTeacher) {
            // VUE ENSEIGNANT (Ses propres cours)
            return [
                { jour: 'Lundi', heure: '08h00 - 10h00', matiere: 'Architecture Log.', niveau: 'L3-INFO', salle: 'Amphi 3', type: 'CM' },
                { jour: 'Vendredi', heure: '10h00 - 12h00', matiere: 'Architecture Log.', niveau: 'M1-INFO', salle: 'A-201', type: 'TP' },
            ];
        } else {
            // VUE ÉTUDIANT (Ses cours filtrés)
            return [
                { jour: 'Lundi', heure: '08h00 - 10h00', matiere: 'Architecture Log.', salle: 'Amphi 3', type: 'CM' },
                { jour: 'Mardi', heure: '14h00 - 16h00', matiere: 'Réseaux', salle: 'B-105', type: 'TD' },
            ];
        }
    } else { // type === "examens"
        if (isDeanView) {
            // VUE DOYEN (Globale des examens)
            return [
                { date: '2025-12-10', heure: '09h00 - 11h00', matiere: 'Bases de Données', niveau: 'L3-INFO', surveillant: 'M. Dubois', salle: 'Grand Amphi', type: 'CC' },
                { date: '2025-01-05', heure: '13h30 - 16h30', matiere: 'Algorithmique', niveau: 'L2-INFO', surveillant: 'Mme. Lefevre', salle: 'C-002', type: 'SN' },
            ];
        } else if (isTeacher) {
            // VUE ENSEIGNANT (Ses surveillances)
            return [
                { date: '2025-12-10', heure: '09h00 - 11h00', matiere: 'Bases de Données', niveau: 'L3-INFO', salle: 'Grand Amphi', role: 'Surveillance', type: 'CC' },
                { date: '2025-01-05', heure: '13h30 - 16h30', matiere: 'Algorithmique', niveau: 'L2-INFO', salle: 'C-002', role: 'Enseignant', type: 'SN' },
            ];
        } else {
             // VUE ÉTUDIANT (Ses examens)
            return [
                { date: '2025-12-10', heure: '09h00 - 11h00', matiere: 'Architecture Log.', salle: 'Grand Amphi', type: 'CC' },
                { date: '2025-01-05', heure: '13h30 - 16h30', matiere: 'Algorithmique', salle: 'C-002', type: 'SN' },
            ];
        }
    }
};

function TimetableViewer({ type, studentLevel, teacherId, isDeanView }) {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);

    // Détermine l'identifiant à utiliser et le contexte
    const identifier = teacherId || studentLevel;
    const isTeacherView = !!teacherId;

    useEffect(() => {
        setLoading(true);
        // Si c'est la vue Doyen OU si on a un identifiant, on charge
        if (isDeanView || identifier) { 
            fetchTimetable(type, identifier, isTeacherView, isDeanView).then(data => {
                setTimetable(data);
                setLoading(false);
            });
        }
    }, [type, identifier, isTeacherView, isDeanView]);

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
    
    if (timetable.length === 0) return <div>Aucun emploi du temps ({type}) disponible.</div>;

    const isExam = type === "examens";
    
    const getTypeStyle = (itemType) => {
        if (isExam) return styles.typeExam;
        if (itemType === 'CM') return styles.typeCM;
        return styles.typeTDTP;
    };

    // Détermination dynamique des en-têtes
    let headers = [isExam ? 'Date' : 'Jour', 'Heure', 'Matière'];
    
    if (isDeanView && !isExam) { // Cours Doyen
        headers.push('Niveau', 'Enseignant');
    } else if (isDeanView && isExam) { // Examens Doyen
         headers.push('Niveau', 'Surveillant');
    } else if (isTeacherView) { // Enseignant
        headers.push('Niveau');
    }
    
    headers.push('Salle', 'Type');

    if (isTeacherView && isExam) { // Rôle pour les surveillances
        headers.push('Rôle');
    }


    const displayTitle = isDeanView 
        ? `Vue Globale des ${type === 'cours' ? 'Cours & TD/TP' : 'Examens (CC/SN)'}`
        : isTeacherView 
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
                                {/* Cellule Jour / Date */}
                                <td style={styles.td}>{isExam ? item.date : item.jour}</td> 
                                <td style={styles.td}>{item.heure}</td>
                                <td style={styles.td}>{item.matiere}</td>

                                {/* Colonnes spécifiques à la vue Doyen/Enseignant */}
                                {(isDeanView || isTeacherView) && <td style={styles.td}>{item.niveau || '-'}</td>}
                                {isDeanView && !isExam && <td style={styles.td}>{item.enseignant || '-'}</td>} 
                                {isDeanView && isExam && <td style={styles.td}>{item.surveillant || '-'}</td>} 

                                <td style={styles.td}>{item.salle}</td>
                                <td style={{...styles.td, ...getTypeStyle(item.type)}}>{item.type}</td>
                                
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

