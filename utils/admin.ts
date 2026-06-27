export const BURKINA_PROVINCES = [
  "Ouagadougou (Kadiogo)", "Bobo-Dioulasso (Houet)", "Koudougou (Boulkiemdé)", 
  "Ouahigouya (Yatenga)", "Kaya (Sanmatenga)", "Banfora (Comoé)", 
  "Dédougou (Mouhoun)", "Tenkodogo (Boulgou)", "Fada N'Gourma (Gourma)", 
  "Dori (Séno)", "Gaoua (Poni)", "Manga (Zoundwéogo)", "Ziniaré (Oubritenga)",
  "Koupéla (Kouritenga)", "Léo (Sissili)", "Orodara (Kénédougou)",
  "Houndé (Tuy)", "Diébougou (Bougouriba)", "Nouna (Kossi)", "Tougan (Sourou)",
  "Kongoussi (Bam)", "Gourcy (Zondoma)", "Boussé (Kourwéogo)", "Zorgho (Ganzourgou)",
  "Pô (Nahouri)", "Bogandé (Gnagna)", "Diapaga (Tapoa)", "Toma (Nayala)",
  "Boromo (Balé)", "Réo (Sanguié)", "Kombissiri (Bazèga)", "Sapouy (Ziro)",
  "Sindou (Léraba)", "Batié (Noumbiel)", "Sebba (Yagha)", "Gayéri (Komondjari)",
  "Djibo (Soum)", "Gorom-Gorom (Oudalan)", "Yako (Passoré)", "Pama (Kompienga)",
  "Dano (Ioba)", "Solenzo (Banwa)", "Boulsa (Namentenga)", "Titao (Loroum)",
  "Ouargaye (Koulpélogo)"
]

export function formatAdminDate(ts: any): string {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatAdminDateTime(ts: any): string {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function getAdminInitials(name: string): string {
  return name 
    ? name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() 
    : '?'
}

export function getStatusLabel(s: string): string {
  const m: Record<string, string> = { 
    active: 'Actif', 
    published: 'Publié', 
    draft: 'Brouillon', 
    archived: 'Archivé', 
    inactive: 'Inactif', 
    open: 'Ouvert', 
    closed: 'Fermé', 
    pinned: 'Épinglé',
    ended: 'Terminé'
  }
  return m[s] ?? s ?? '—'
}

export function getStatusBadgeClass(s: string): string {
  const m: Record<string, string> = {
    active:    'bg-green-50 text-green-700',
    published: 'bg-green-50 text-green-700',
    draft:     'bg-amber-50 text-amber-700',
    archived:  'bg-gray-100 text-gray-400',
    inactive:  'bg-red-50 text-red-500',
    ended:     'bg-red-50 text-red-500',
    closed:    'bg-gray-100 text-gray-500',
  }
  return m[s] ?? 'bg-gray-100 text-gray-500'
}
