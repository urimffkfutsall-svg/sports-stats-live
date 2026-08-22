import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Player, Team, Match } from '@/types';

interface GenerateMatchSheetPdfArgs {
  match: Match;
  team: Team;
  opponentName: string;
  players: Player[];
  selectedPlayerIds: string[];
  captainId?: string;
  goalkeeperId?: string;
}

export function generateMatchSheetPdf(args: GenerateMatchSheetPdfArgs) {
  const { match, team, opponentName, players, selectedPlayerIds, captainId, goalkeeperId } = args;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PROTOKOLLI ELEKTRONIK I NDESHJES', 105, 18, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Skuadra: ${team.name}`, 14, 30);
  doc.text(`Kundershtari: ${opponentName}`, 14, 36);
  doc.text(`Data: ${match.date || '-'}   Ora: ${match.time || '-'}`, 14, 42);
  doc.text(`Vendi: ${match.venue || '-'}`, 14, 48);
  doc.text(`Gjeneruar me: ${new Date().toLocaleString('sq-AL')}`, 14, 54);

  const selectedPlayers = players.filter(p => selectedPlayerIds.includes(p.id));
  const rows = selectedPlayers.map((p, i) => {
    const roleTags: string[] = [];
    if (p.id === captainId) roleTags.push('Kapiten (C)');
    if (p.id === goalkeeperId) roleTags.push('Portier (GK)');
    return [String(i + 1), `${p.firstName} ${p.lastName}`, p.position || '-', roleTags.join(', ') || '-'];
  });

  autoTable(doc, {
    startY: 62,
    head: [['#', 'Lojtari', 'Pozita', 'Roli']],
    body: rows.length > 0 ? rows : [['-', 'Asnje lojtar i zgjedhur', '-', '-']],
    headStyles: { fillColor: [15, 24, 48] },
    styles: { fontSize: 9 },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 80;
  doc.setFontSize(9);
  doc.text('Nenshkrimi i pergjegjesit te skuadres: ______________________', 14, finalY + 20);
  doc.text('Nenshkrimi i delegatit: ______________________', 14, finalY + 30);

  const safeTeamName = team.name.replace(/[^a-z0-9]+/gi, '-');
  doc.save(`protokolli-${safeTeamName}-${match.date || 'ndeshje'}.pdf`);
}
