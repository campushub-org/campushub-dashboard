// src/components/AvailabilityForm.jsx
import React, { useState } from 'react';

// Jours de la semaine pour le formulaire
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi','Samedi','Dimanche'];
// Crénaux horaires simplifiés pour l'exemple
const SLOTS = ['07h-9h55', '10h05-12h55', '13h05-15h55', '16h05-18h55','19h05-21h55'];

function AvailabilityForm({ teacherId }) {
    // État pour stocker la grille de disponibilité (e.g., {'Lundi': ['08h-10h', '10h-12h']})
    const [availability, setAvailability] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleAvailability = (day, slot) => {
        setAvailability(prev => {
            const daySlots = prev[day] || [];
            if (daySlots.includes(slot)) {
                return { ...prev, [day]: daySlots.filter(s => s !== slot) };
            } else {
                return { ...prev, [day]: [...daySlots, slot] };
            }
        });
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage("Enregistrement des disponibilités...");
        
        console.log(`[API Call] POST /api/v1/scheduling/availability/teacher/${teacherId}`);
        // En réalité: Appel API au Scheduling Service pour envoyer les disponibilités
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        
        setMessage("Disponibilités enregistrées avec succès ! Le système peut maintenant générer votre emploi du temps.");
        setLoading(false);
    };

    const styles = {
        container: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
        title: { fontSize: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' },
        grid: { display: 'grid', gridTemplateColumns: `100px repeat(${SLOTS.length}, 1fr)`, border: '1px solid #ccc', borderCollapse: 'collapse' },
        cell: { border: '1px solid #eee', padding: '10px', textAlign: 'center' },
        headerCell: { backgroundColor: '#f9fafb', fontWeight: 'bold' },
        dayHeader: { textAlign: 'left', fontWeight: 'bold', backgroundColor: '#eef2ff' },
        slotButton: (isAvailable) => ({
            width: '100%',
            padding: '10px 0',
            border: 'none',
            borderRadius: '0',
            cursor: 'pointer',
            backgroundColor: isAvailable ? '#10b981' : '#fef2f2', // Vert pour disponible, Rouge très clair pour indisponible
            color: isAvailable ? 'white' : '#6b7280',
            transition: 'background-color 0.2s',
            fontWeight: isAvailable ? 'bold' : 'normal'
        }),
        saveButton: { marginTop: '20px', padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: loading ? 0.7 : 1 },
        message: { padding: '10px', borderRadius: '4px', backgroundColor: '#eef2ff', color: '#4f46e5', marginBottom: '20px', marginTop: '10px' },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>4. Remplir mes heures de disponibilité</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Cliquez sur les créneaux où vous êtes disponible pour donner des cours (CM/TD/TP).
            </p>
            
            {message && <div style={styles.message}>{message}</div>}

            <div style={styles.grid}>
                {/* Ligne d'en-tête (Heures) */}
                <div style={{...styles.cell, ...styles.headerCell}}>Jour / Heure</div>
                {SLOTS.map(slot => (
                    <div key={slot} style={{...styles.cell, ...styles.headerCell}}>{slot}</div>
                ))}
                
                {/* Corps du tableau (Disponibilités) */}
                {DAYS.map(day => (
                    <React.Fragment key={day}>
                        <div style={{...styles.cell, ...styles.dayHeader}}>{day}</div>
                        {SLOTS.map(slot => {
                            const isAvailable = availability[day] && availability[day].includes(slot);
                            return (
                                <div key={slot} style={styles.cell}>
                                    <button
                                        style={styles.slotButton(isAvailable)}
                                        onClick={() => toggleAvailability(day, slot)}
                                        disabled={loading}
                                    >
                                        {isAvailable ? 'DISPONIBLE' : 'Indisponible'}
                                    </button>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>

            <button onClick={handleSave} style={styles.saveButton} disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer les Disponibilités'}
            </button>
        </div>
    );
}

export default AvailabilityForm;

