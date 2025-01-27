import { pick } from "lodash";

const outputProps = ["time", "player", "message", "evaluation"];

// Evaluation formats
const evalFormats = [
  {
    pattern: /(?:\W|^)([+-][.0-9]+)(?:\W|$)/,
    format: (v) => v * 100,
  },
  {
    pattern: /(?:\W|^)([.0-9]+)%(?:\W|$)/,
    format: (v) => v * 2 - 100,
  },
];

export function getEvaluation(message) {
  let matches;

  for (let i = 0; i < evalFormats.length; i++) {
    matches = message.match(evalFormats[i].pattern);
    if (matches) {
      return Math.max(
        -100,
        Math.min(100, evalFormats[i].format(Number(matches[1])))
      );
    }
  }

  return null;
}

export default class Comment {
  constructor(notation) {
    const matchData = notation.match(/\{((@[^"}]+:)?([0-9]+:)?([^}]*))\}/);

    if (!matchData) {
      throw new Error("Invalid comment");
    }

    [this.ptn, this.contents, this.player, this.time, this.message] = matchData;

    this.time = this.time ? Number(this.time) : null;

    if (this.player) {
      this.player = this.player.substr(1);
      if (/[1|2]/.test(this.player)) {
        this.player = Number(this.player);
      }
    } else {
      this.player = null;
    }
  }

  get evaluation() {
    return getEvaluation(this.message);
  }

  get output() {
    const output = pick(this, outputProps);
    return Object.freeze(output);
  }

  static test(notation) {
    return /^\s*\{/.test(notation);
  }

  static parse(notation) {
    return new Comment(notation);
  }

  toString() {
    return (
      "{" +
      (this.player ? "@" + this.player + ":" : "") +
      (this.time === null ? "" : `${this.time}:`) +
      (this.time !== null || this.player ? " " : "") +
      this.message +
      "}"
    );
  }
}
