export function getChapterLabel(stageIndex: number, stageName: string): string {
  if (stageIndex < 10) return 'World Tour: First Flight'
  if (stageIndex < 20) return 'World Tour: Grand Circuit'
  if (stageIndex < 30) return 'World Tour II'
  return stageName.match(/\(([^)]+)\)$/)?.[1] ?? 'Unknown World'
}
