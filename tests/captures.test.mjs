import test from 'node:test';
import assert from 'node:assert/strict';
import { jumpsFrom, availableJumps, applyJump, squareName } from '../learn/engine.mjs';
import { positions } from '../learn/positions.mjs';
const p=(col,row,owner='light',kind='man')=>({col,row,owner,kind});

test('each teaching board has exactly the intended capture route and no quiet-move shortcut',()=>{
  for(const lesson of positions){
    let pieces=structuredClone(lesson.pieces), continuing=null;
    const route=[];
    for(let i=1;i<lesson.expected.length;i++){
      const moves=availableJumps(pieces,'light',continuing);
      assert.equal(moves.length,1,lesson.id);
      const move=moves[0];
      if(i===1)route.push(squareName(move.from));
      const before=pieces.length;
      const result=applyJump(pieces,move);
      assert.equal(result.pieces.length,before-1);
      pieces=result.pieces;continuing=result.continuation.length?move.to:null;route.push(squareName(move.to));
      assert.equal(Boolean(continuing),i<lesson.expected.length-1);
    }
    assert.deepEqual(route,lesson.expected);
  }
});
test('a man cannot jump backward, but a king can',()=>{
  assert.equal(jumpsFrom([p(3,2),p(2,3,'dark')],p(3,2)).length,0);
  assert.deepEqual(jumpsFrom([p(3,2,'light','king'),p(2,3,'dark')],p(3,2))[0].to,{col:1,row:4});
});
test('capture must land on an empty square and jump an enemy',()=>{
  assert.equal(jumpsFrom([p(2,5),p(3,4,'dark'),p(4,3)],p(2,5)).length,0);
  assert.equal(jumpsFrom([p(2,5),p(3,4)],p(2,5)).length,0);
  assert.throws(()=>applyJump([p(2,5),p(3,4,'dark')],{from:p(2,5),to:p(3,4)}),/Illegal/);
});
test('American crowning ends the capture turn even when the new king has a backward jump',()=>{
  const pieces=[p(1,2),p(2,1,'dark'),p(4,1,'dark')];
  const result=applyJump(pieces,{from:p(1,2),to:p(3,0)});
  assert.equal(result.crowned,true);assert.deepEqual(result.continuation,[]);
  assert.equal(result.pieces.find(x=>x.col===3&&x.row===0).kind,'king');
  assert.equal(jumpsFrom(result.pieces,p(3,0)).length,1);
});
test('alternate captures are available even when one later route is longer',()=>{
  const pieces=[p(3,6),p(2,5,'dark'),p(4,5,'dark'),p(6,3,'dark')];
  const moves=availableJumps(pieces,'light');assert.equal(moves.length,2);
  assert.equal(applyJump(pieces,moves.find(m=>m.to.col===1)).continuation.length,0);
  assert.equal(applyJump(pieces,moves.find(m=>m.to.col===5)).continuation.length,1);
});
test('continuation stays with the same piece and move application leaves input untouched',()=>{
  const original=[p(2,5),p(3,4,'dark'),p(5,2,'dark'),p(0,5),p(1,4,'dark')];
  const snapshot=structuredClone(original);
  const result=applyJump(original,{from:p(2,5),to:p(4,3)});
  assert.deepEqual(original,snapshot);
  const moves=availableJumps(result.pieces,'light',{col:4,row:3});
  assert.equal(moves.length,1);assert.deepEqual(moves[0].from,{col:4,row:3});
});
