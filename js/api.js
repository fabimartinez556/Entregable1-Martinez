// api.js
// Simula datos remotos usando un JSON local (se consume con fetch)
export async function fetchDisponibles() {
  try {
    const res = await fetch("data/disponibles.json");
    if (!res.ok) throw new Error("No se pudo cargar disponibles.json");
    const data = await res.json();
    // Normalizamos por si faltan campos opcionales
    return data.map(m => ({
      sociable: "Sí",
      cuidados: "",
      observaciones: "",
      estado: "Disponible",
      ...m
    }));
  } catch (e) {
    // Fallback seguro si falla el fetch
    return [
      {
        id: 1,
        nombre: "Luna",
        raza: "Mestiza",
        edad: 2,
        peso: 12,
        imagen: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
        sociable: "Sí",
        cuidados: "",
        observaciones: "Muy cariñosa",
        estado: "Disponible"
      },
      {
        id: 2,
        nombre: "Milo",
        raza: "Labrador",
        edad: 3,
        peso: 25,
        imagen: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop",
        sociable: "Sí",
        cuidados: "Dieta balanceada",
        observaciones: "",
        estado: "Disponible"
      }
    ];
  }
}
