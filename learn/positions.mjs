export const positions = [
  {
    "id": "capture-first",
    "title": "A jump comes first.",
    "instruction": "White to move. Tap a white piece, then its landing square.",
    "rule": "When a capture is available, you must capture. An ordinary move cannot replace it.",
    "initial": "Find a white piece that can jump over black.",
    "pieces": [
      {
        "col": 2,
        "row": 5,
        "owner": "light",
        "kind": "man"
      },
      {
        "col": 6,
        "row": 5,
        "owner": "light",
        "kind": "man"
      },
      {
        "col": 3,
        "row": 4,
        "owner": "dark",
        "kind": "man"
      }
    ],
    "focus": {
      "col": 2,
      "row": 5
    },
    "expected": [
      "c3",
      "e5"
    ],
    "success": "c3 to e5 captures d4. The other white piece had ordinary moves, but a capture takes priority."
  },
  {
    "id": "finish-the-turn",
    "title": "One jump is not the end.",
    "instruction": "White to move. Trace the entire capture route with the same man.",
    "rule": "If another capture is available after a jump, continue with that same piece.",
    "initial": "Find the first landing square. Then look for the next jump.",
    "pieces": [
      {
        "col": 4,
        "row": 5,
        "owner": "light",
        "kind": "man"
      },
      {
        "col": 5,
        "row": 4,
        "owner": "dark",
        "kind": "man"
      },
      {
        "col": 5,
        "row": 2,
        "owner": "dark",
        "kind": "man"
      }
    ],
    "focus": {
      "col": 4,
      "row": 5
    },
    "expected": [
      "e3",
      "g5",
      "e7"
    ],
    "success": "e3 to g5 to e7. Both jumps belong to one turn. The man is still not on the king row."
  },
  {
    "id": "king-turn",
    "title": "A king can change direction.",
    "instruction": "White to move. The white piece marked with a star is a king.",
    "rule": "A king can capture backward as well as forward. The same capture-continuation rule applies.",
    "initial": "Find the king and follow its complete route.",
    "pieces": [
      {
        "col": 5,
        "kind": "king",
        "owner": "light",
        "row": 0
      },
      {
        "col": 7,
        "kind": "man",
        "owner": "dark",
        "row": 0
      },
      {
        "col": 2,
        "kind": "man",
        "owner": "dark",
        "row": 1
      },
      {
        "col": 4,
        "kind": "man",
        "owner": "dark",
        "row": 1
      },
      {
        "col": 5,
        "kind": "man",
        "owner": "dark",
        "row": 2
      },
      {
        "col": 0,
        "kind": "man",
        "owner": "dark",
        "row": 3
      },
      {
        "col": 1,
        "kind": "man",
        "owner": "light",
        "row": 4
      },
      {
        "col": 3,
        "kind": "man",
        "owner": "light",
        "row": 4
      },
      {
        "col": 5,
        "kind": "man",
        "owner": "dark",
        "row": 4
      },
      {
        "col": 7,
        "kind": "man",
        "owner": "light",
        "row": 4
      },
      {
        "col": 3,
        "kind": "man",
        "owner": "light",
        "row": 6
      },
      {
        "col": 0,
        "kind": "man",
        "owner": "light",
        "row": 7
      },
      {
        "col": 4,
        "kind": "man",
        "owner": "light",
        "row": 7
      },
      {
        "col": 6,
        "kind": "man",
        "owner": "light",
        "row": 7
      }
    ],
    "focus": {
      "col": 5,
      "row": 0
    },
    "expected": [
      "f8",
      "d6",
      "b8"
    ],
    "success": "f8 to d6 to b8. The king changed direction after its first capture and finished the route."
  }
];
