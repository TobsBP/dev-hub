export function formatDate(dateStr: string): string {
	const normalized = dateStr.includes('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;
	return new Date(normalized).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
	});
}
