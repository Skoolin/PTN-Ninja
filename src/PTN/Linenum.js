import { compact, last } from "lodash";

export default class Linenum {
  constructor(notation, game, branch = "") {
    const matchData = notation.match(/((?:[\d-]+\.+|\/)+)?(\d+\.+)/);

    if (!matchData) {
      throw new Error("Invalid line number");
    }

    [this.ptn, this.branch, this.number] = matchData;
    this.number = parseInt(this.number, 10);
    if (!this.branch && branch) {
      this.branch = branch;
    }
    if (this.branch) {
      this.parseBranch(game);
    } else {
      this.branch = "";
      this.ancestors = [];
    }
    this.move = null;
  }

  static test(notation) {
    return /^\s*([\d-]+(\.+|\/))*(\d+\.+)/.test(notation);
  }

  static parse(notation, game, branch) {
    return new Linenum(notation, game, branch);
  }

  static validateBranch(notation, isWholeBranch = false) {
    return (isWholeBranch ? /^[^}\r\n]+$/ : /^[^}\r\n/]+$/).test(notation);
  }

  get splitBranch() {
    return compact(this.branch.split(/[./](?=[^./]+|$)/));
  }

  parseBranch(game) {
    const ancestors = this.splitBranch;
    this.ancestors = ancestors.map((ancestor, i) => {
      return ancestors.slice(0, i + 1).join("/");
    });
    this.branch = this.ancestors.pop();
    this.parentBranch = this.ancestors.length ? last(this.ancestors) : "";
    this.isRoot = !(this.branch in game.branches);
    this.parentNumber = this.isRoot
      ? this.number
      : game.branches[this.branch].move.number;
  }

  text(showBranch = true) {
    return (
      (showBranch && this.isRoot && this.branch ? `{${this.branch}}\n` : "") +
      this.number +
      "."
    );
  }
}
