import { availableJumps, applyJump, sameSquare, squareName } from './engine.mjs';
import { positions } from './positions.mjs';

const $ = id => document.getElementById(id);
const board = $('board');
let lesson = 0, pieces, selected, continuing, route, complete, focusSquare;

function say(text, success = false) {
  $('feedback').textContent = text;
  $('feedback').classList.toggle('success', success);
}

function draw() {
  board.replaceChildren();
  for (let row = 0; row < 8; row++) {
    const line = document.createElement('div');
    line.className = 'board-row'; line.setAttribute('role', 'row');
    for (let col = 0; col < 8; col++) {
      const square = { col, row }, piece = pieces.find(p => sameSquare(p, square));
      const cell = document.createElement('button');
      cell.type = 'button'; cell.className = 'square' + ((col + row) % 2 ? ' dark' : '');
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-rowindex', row + 1); cell.setAttribute('aria-colindex', col + 1);
      cell.dataset.col = col; cell.dataset.row = row;
      cell.tabIndex = sameSquare(square, focusSquare) ? 0 : -1;
      const chosen = selected && sameSquare(selected, square);
      cell.setAttribute('aria-selected', chosen ? 'true' : 'false');
      if (chosen) cell.classList.add('selected');
      if (route.length > 1 && sameSquare(route.at(-1), square)) cell.classList.add('last');
      cell.setAttribute('aria-label', `${squareName(square)}, ${piece ? (piece.owner === 'light' ? 'white' : 'black') + ' ' + piece.kind : 'empty'}${chosen ? ', selected' : ''}`);
      const coordinate = document.createElement('span'); coordinate.className = 'coord'; coordinate.textContent = squareName(square); coordinate.setAttribute('aria-hidden', 'true'); cell.append(coordinate);
      if (piece) {
        const disc = document.createElement('span'); disc.className = 'piece ' + (piece.owner === 'light' ? 'light' : 'black'); disc.textContent = piece.kind === 'king' ? '★' : ''; disc.setAttribute('aria-hidden', 'true'); cell.append(disc);
      }
      cell.addEventListener('click', () => choose(square));
      cell.addEventListener('keydown', event => {
        const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
        if (!delta) return;
        event.preventDefault();
        focusSquare = { col: Math.max(0, Math.min(7, col + delta[0])), row: Math.max(0, Math.min(7, row + delta[1])) };
        draw(); focusCell();
      });
      line.append(cell);
    }
    board.append(line);
  }
  $('path').textContent = route.length ? route.map(squareName).join(' → ') : '';
}

function focusCell() { board.querySelector(`[data-col="${focusSquare.col}"][data-row="${focusSquare.row}"]`).focus({ preventScroll: true }); }

function reject(message) { say(message); draw(); focusCell(); }

function choose(square) {
  focusSquare = square;
  if (complete) { say('Position complete. Choose Next position, or reset to try it again.', true); return; }
  const jumps = availableJumps(pieces, 'light', continuing);
  const piece = pieces.find(p => sameSquare(p, square));
  if (piece && piece.owner === 'light') {
    if (continuing && !sameSquare(continuing, square)) { reject('Keep jumping with the same piece until its capture route is complete.'); return; }
    if (!jumps.some(j => sameSquare(j.from, square))) { reject('That piece has no capture. Look for a white piece beside black with an empty square beyond.'); return; }
    selected = square; say('Piece selected. Tap the empty square immediately beyond the black piece.'); draw(); focusCell(); return;
  }
  if (!selected) { reject('Choose a white piece that can capture first.'); return; }
  const move = jumps.find(j => sameSquare(j.from, selected) && sameSquare(j.to, square));
  if (!move) { reject('That is not a capture landing square. Jump over one adjacent black piece onto the empty square beyond.'); return; }
  const result = applyJump(pieces, move); pieces = result.pieces;
  if (!route.length) route.push(move.from);
  route.push(move.to); selected = move.to; continuing = result.continuation.length ? move.to : null;
  if (continuing) say('One jump made. Another capture is available with this piece, so the turn must continue.');
  else {
    complete = true; selected = null;
    $('next').hidden = false; $('hint').hidden = true;
    $('next').textContent = lesson === positions.length - 1 ? 'Finish the challenge →' : 'Next position →';
    say(positions[lesson].success, true);
  }
  draw(); focusCell();
}

function start(index) {
  lesson = index; pieces = positions[lesson].pieces.map(p => ({ ...p })); selected = null; continuing = null; route = []; complete = false; focusSquare = positions[lesson].focus;
  $('lesson-count').textContent = `POSITION ${lesson + 1} OF ${positions.length}`;
  $('lesson-title').textContent = positions[lesson].title;
  $('rule-copy').textContent = positions[lesson].rule;
  $('instruction').textContent = positions[lesson].instruction;
  $('progress').replaceChildren(...positions.map((_, i) => { const dot = document.createElement('span'); if (i <= lesson) dot.className = 'done'; return dot; }));
  $('progress').setAttribute('aria-label', `Position ${lesson + 1} of ${positions.length}`);
  $('next').hidden = true; $('hint').hidden = false; $('finish').hidden = true;
  say(positions[lesson].initial); draw();
}

$('hint').addEventListener('click', () => {
  const jumps = availableJumps(pieces, 'light', continuing);
  if (!jumps.length) return;
  const move = jumps[0]; selected = move.from; focusSquare = move.from;
  say(`Hint: select ${squareName(move.from)} and land on ${squareName(move.to)}.`); draw(); focusCell();
});
$('reset').addEventListener('click', () => { start(lesson); focusCell(); });
$('next').addEventListener('click', () => {
  if (lesson < positions.length - 1) { start(lesson + 1); focusCell(); }
  else { $('finish').hidden = false; $('finish-title').tabIndex = -1; $('finish-title').focus(); $('finish').scrollIntoView({ behavior: 'auto', block: 'center' }); }
});
$('again').addEventListener('click', () => { start(0); $('practice').scrollIntoView({ behavior: 'auto', block: 'start' }); focusCell(); });
start(0);
