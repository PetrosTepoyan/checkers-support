const key = ({ col, row }) => `${col},${row}`;
export const squareName = ({ col, row }) => `${'abcdefgh'[col]}${8 - row}`;
export const sameSquare = (a, b) => a.col === b.col && a.row === b.row;

export function jumpsFrom(pieces, from) {
  const piece = pieces.find(p => sameSquare(p, from));
  if (!piece) return [];
  const occupied = new Map(pieces.map(p => [key(p), p]));
  const directions = piece.kind === 'king' ? [-1, 1] : [piece.owner === 'light' ? -1 : 1];
  const jumps = [];
  for (const dy of directions) for (const dx of [-1, 1]) {
    const captured = { col: piece.col + dx, row: piece.row + dy };
    const to = { col: piece.col + dx * 2, row: piece.row + dy * 2 };
    const enemy = occupied.get(key(captured));
    if (to.col < 0 || to.col > 7 || to.row < 0 || to.row > 7) continue;
    if (enemy && enemy.owner !== piece.owner && !occupied.has(key(to))) jumps.push({ from: { col: piece.col, row: piece.row }, to, captured });
  }
  return jumps;
}

export function availableJumps(pieces, owner, continuingFrom = null) {
  if (continuingFrom) return jumpsFrom(pieces, continuingFrom);
  return pieces.filter(p => p.owner === owner).flatMap(p => jumpsFrom(pieces, p));
}

export function applyJump(pieces, move) {
  const legal = jumpsFrom(pieces, move.from).find(j => sameSquare(j.to, move.to));
  if (!legal) throw new Error('Illegal capture');
  const moving = pieces.find(p => sameSquare(p, move.from));
  const crowned = moving.kind === 'man' && legal.to.row === (moving.owner === 'light' ? 0 : 7);
  const next = pieces.filter(p => !sameSquare(p, legal.from) && !sameSquare(p, legal.captured))
    .map(p => ({ ...p }));
  next.push({ ...moving, ...legal.to, kind: crowned ? 'king' : moving.kind });
  // In American checkers, promotion completes this turn, even if the new king could jump.
  return { pieces: next, crowned, continuation: crowned ? [] : jumpsFrom(next, legal.to) };
}
