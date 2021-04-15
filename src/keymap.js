import { forEach, upperFirst } from "lodash";

export const HOTKEYS = {
  ACTIONS: {
    "game/UNDO": ["ctrl", "z"],
    "game/REDO": ["ctrl", "shift", "z"],
    "game/EXPORT_PNG": ["ctrl", "shift", "p"],
    "ui/EXPORT_PTN": ["ctrl", "s"],
    "ui/OPEN": ["ctrl", "o"],
    "ui/RESET_TRANSFORM": ["="],
    "ui/ROTATE_180": ["-"],
    "ui/ROTATE_LEFT": ["["],
    "ui/ROTATE_RIGHT": ["]"],
    "ui/FLIP_HORIZONTAL": [";"],
    "ui/FLIP_VERTICAL": ["shift", ":"],
  },
  CONTROLS: {
    playpause: ["space"],
    prev: ["arrowleft"],
    next: ["arrowright"],
    prevHalf: ["shift", "arrowleft"],
    nextHalf: ["shift", "arrowright"],
    first: ["ctrl", "arrowleft"],
    last: ["ctrl", "arrowright"],
    deletePly: ["del"],
    backspacePly: ["backspace"],
    branchMenu: ["b"],
    selectBranch: ["0-9"],
    prevBranch: ["arrowup"],
    nextBranch: ["arrowdown"],
    prevBranchEnd: ["shift", "arrowup"],
    nextBranchEnd: ["shift", "arrowdown"],
    firstBranch: ["ctrl", "arrowup"],
    lastBranch: ["ctrl", "arrowdown"],
    firstBranchEnd: ["ctrl", "shift", "arrowup"],
    lastBranchEnd: ["ctrl", "shift", "arrowdown"],
  },
  UI: {
    showPTN: ["q"],
    showText: ["w"],
    notifyGame: ["g"],
    notifyNotes: ["a"],
    animateBoard: ["shift", "a"],
    showAllBranches: ["shift", "b"],
    axisLabels: ["x"],
    board3D: ["d"],
    showRoads: ["r"],
    highlightSquares: ["h"],
    pieceShadows: ["shift", "s"],
    turnIndicator: ["t"],
    flatCounts: ["f"],
    unplayedPieces: ["u"],
    showMove: ["m"],
    showControls: ["c"],
    showScrubber: ["s"],
  },
  MISC: {
    hotkeys: ["ctrl", "/"],
    help: ["ctrl", "shift", "?"],
    account: ["ctrl", "shift", "a"],
    preferences: ["p"],
    theme: ["shift", "t"],
    share: ["ctrl", "shift", "s"],
    online: ["shift", "o"],
    newGame: ["n"],
    loadGame: ["l"],
    loadOnlineGame: ["o"],
    editGame: ["e"],
    editPTN: ["shift", "e"],
    embedGame: ["ctrl", "e"],
    sharePNG: ["shift", "p"],
    fullscreen: ["shift", "f"],
    qrCode: ["shift", "q"],
    focusText: ["/"],
    focusGame: ["\\"],
    previousGame: ["alt", "\\"],
    toggleText: ["shift", "w"],
    more: ["shift", "space"],
  },
  EVAL: {
    tak: ["'"],
    tinue: ["shift", '"'],
    question: ["shift", "?"],
    questionDouble: ["alt", "shift", "?"],
    bang: ["shift", "!"],
    bangDouble: ["alt", "shift", "!"],
  },
  PIECE: {
    color: ["`"],
    F: ["1"],
    S: ["2"],
    C: ["3"],
  },
};

export const HOTKEY_NAMES = {
  ACTIONS: {
    "game/UNDO": "Undo",
    "game/REDO": "Redo",
    "game/EXPORT_PNG": "Export PNG Image",
    "ui/EXPORT_PTN": "Export PTN File",
    "ui/OPEN": "Load Files",
    "ui/RESET_TRANSFORM": "Reset Board Transformation",
    "ui/ROTATE_180": "Rotate 180",
    "ui/ROTATE_LEFT": "Rotate Left",
    "ui/ROTATE_RIGHT": "Rotate Right",
    "ui/FLIP_HORIZONTAL": "Flip Horizontally",
    "ui/FLIP_VERTICAL": "Flip Vertically",
  },
  CONTROLS: {
    playpause: "Play/Pause",
    prev: "Backward",
    next: "Forward",
    prevHalf: "Backward Half-Step",
    nextHalf: "Forward Half-Step",
    first: "Beginning",
    last: "End",
    deletePly: "Delete Ply",
    branchMenu: "Show Branch Menu",
    selectBranch: "Select Branch",
    prevBranch: "Previous Branch",
    nextBranch: "Next Branch",
    prevBranchEnd: "Previous Branch End",
    nextBranchEnd: "Next Branch End",
    firstBranch: "First Branch",
    lastBranch: "Last Branch",
    firstBranchEnd: "First Branch End",
    lastBranchEnd: "Last Branch End",
  },
  UI: {
    showPTN: "Show PTN",
    showText: "Show Text",
    notifyGame: "Game Notifications",
    notifyNotes: "Note Notifications",
    animateBoard: "Animate Board",
    showAllBranches: "Show All Branches",
    axisLabels: "Axis Labels",
    board3D: "3D Board",
    showRoads: "Road Connections",
    highlightSquares: "Highlight Squares",
    pieceShadows: "Piece Shadows",
    turnIndicator: "Turn Indicator",
    flatCounts: "Flat Counts",
    unplayedPieces: "Unplayed Pieces",
    showMove: "Current Move",
    showControls: "Play Controls",
    showScrubber: "Scrub Bar",
  },
  EVAL: {
    tak: "Tak",
    tinue: "Tinue",
    question: "?",
    questionDouble: "??",
    bang: "!",
    bangDouble: "!!",
  },
  PIECE: {
    color: "Switch Player",
    F: "Flats",
    S: "Walls",
    C: "Caps",
  },
  MISC: {
    hotkeys: "Hotkeys",
    help: "Help",
    account: "Account",
    preferences: "Preferences",
    theme: "Theme",
    share: "Share",
    online: "Play Online",
    newGame: "New Game",
    loadGame: "Load Game",
    loadOnlineGame: "Load Online Game",
    editGame: "Edit Game",
    editPTN: "Edit PTN",
    embedGame: "Embed",
    sharePNG: "Share PNG",
    fullscreen: "Fullscreen",
    qrCode: "QR Code",
    focusText: "Focus Text Input",
    focusGame: "Focus Game Selector",
    previousGame: "Previous Game",
    toggleText: "Switch Text Tab",
    more: "Show More/Less",
  },
};

let formatted = { ...HOTKEYS };
forEach(formatted, (category, categoryID) => {
  formatted[categoryID] = { ...category };
  forEach(
    category,
    (keys, id) => (formatted[categoryID][id] = keys.map(upperFirst).join(" + "))
  );
});
export const HOTKEYS_FORMATTED = formatted;
