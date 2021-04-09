"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ic10Runtime = void 0;
const events_1 = require("events");
class ic10Runtime extends events_1.EventEmitter {
    constructor(_fileAccessor) {
        super();
        this._fileAccessor = _fileAccessor;
        this._sourceFile = '';
        this._sourceLines = [];
        this._currentLine = 0;
        this._breakPoints = new Map();
        this._breakpointId = 1;
        this._breakAddresses = new Set();
        this._noDebug = false;
        this._otherExceptions = false;
    }
    get sourceFile() {
        return this._sourceFile;
    }
    async start(program, stopOnEntry, noDebug) {
        this._noDebug = noDebug;
        await this.loadSource(program);
        this._currentLine = -1;
        await this.verifyBreakpoints(this._sourceFile);
        if (stopOnEntry) {
            this.step(false, 'stopOnEntry');
        }
        else {
            this.continue();
        }
    }
    continue(reverse = false) {
        this.run(reverse, undefined);
    }
    step(reverse = false, event = 'stopOnStep') {
        this.run(reverse, event);
    }
    stepIn(targetId) {
        if (typeof targetId === 'number') {
            this._currentColumn = targetId;
            this.sendEvent('stopOnStep');
        }
        else {
            if (typeof this._currentColumn === 'number') {
                if (this._currentColumn <= this._sourceLines[this._currentLine].length) {
                    this._currentColumn += 1;
                }
            }
            else {
                this._currentColumn = 1;
            }
            this.sendEvent('stopOnStep');
        }
    }
    stepOut() {
        if (typeof this._currentColumn === 'number') {
            this._currentColumn -= 1;
            if (this._currentColumn === 0) {
                this._currentColumn = undefined;
            }
        }
        this.sendEvent('stopOnStep');
    }
    getStepInTargets(frameId) {
        const line = this._sourceLines[this._currentLine].trim();
        const words = line.split(/\s+/);
        if (frameId < 0 || frameId >= words.length) {
            return [];
        }
        const frame = words[frameId];
        const pos = line.indexOf(frame);
        return frame.split('').map((c, ix) => {
            return {
                id: pos + ix,
                label: `target: ${c}`
            };
        });
    }
    stack(startFrame, endFrame) {
        const words = this._sourceLines[this._currentLine].trim().split(/\s+/);
        const frames = new Array();
        for (let i = startFrame; i < Math.min(endFrame, words.length); i++) {
            const name = words[i];
            const stackFrame = {
                index: i,
                name: `${name}(${i})`,
                file: this._sourceFile,
                line: this._currentLine
            };
            if (typeof this._currentColumn === 'number') {
                stackFrame.column = this._currentColumn;
            }
            frames.push(stackFrame);
        }
        return {
            frames: frames,
            count: words.length
        };
    }
    getBreakpoints(path, line) {
        const l = this._sourceLines[line];
        let sawSpace = true;
        const bps = [];
        for (let i = 0; i < l.length; i++) {
            if (l[i] !== ' ') {
                if (sawSpace) {
                    bps.push(i);
                    sawSpace = false;
                }
            }
            else {
                sawSpace = true;
            }
        }
        return bps;
    }
    async setBreakPoint(path, line) {
        const bp = { verified: false, line, id: this._breakpointId++ };
        let bps = this._breakPoints.get(path);
        if (!bps) {
            bps = new Array();
            this._breakPoints.set(path, bps);
        }
        bps.push(bp);
        await this.verifyBreakpoints(path);
        return bp;
    }
    clearBreakPoint(path, line) {
        const bps = this._breakPoints.get(path);
        if (bps) {
            const index = bps.findIndex(bp => bp.line === line);
            if (index >= 0) {
                const bp = bps[index];
                bps.splice(index, 1);
                return bp;
            }
        }
        return undefined;
    }
    clearBreakpoints(path) {
        this._breakPoints.delete(path);
    }
    setDataBreakpoint(address) {
        if (address) {
            this._breakAddresses.add(address);
            return true;
        }
        return false;
    }
    setExceptionsFilters(namedException, otherExceptions) {
        this._namedException = namedException;
        this._otherExceptions = otherExceptions;
    }
    clearAllDataBreakpoints() {
        this._breakAddresses.clear();
    }
    async loadSource(file) {
        if (this._sourceFile !== file) {
            this._sourceFile = file;
            const contents = await this._fileAccessor.readFile(file);
            this._sourceLines = contents.split(/\r?\n/);
        }
    }
    run(reverse = false, stepEvent) {
        if (reverse) {
            for (let ln = this._currentLine - 1; ln >= 0; ln--) {
                if (this.fireEventsForLine(ln, stepEvent)) {
                    this._currentLine = ln;
                    this._currentColumn = undefined;
                    return;
                }
            }
            this._currentLine = 0;
            this._currentColumn = undefined;
            this.sendEvent('stopOnEntry');
        }
        else {
            for (let ln = this._currentLine + 1; ln < this._sourceLines.length; ln++) {
                if (this.fireEventsForLine(ln, stepEvent)) {
                    this._currentLine = ln;
                    this._currentColumn = undefined;
                    return true;
                }
            }
            this.sendEvent('end');
        }
    }
    async verifyBreakpoints(path) {
        if (this._noDebug) {
            return;
        }
        const bps = this._breakPoints.get(path);
        if (bps) {
            await this.loadSource(path);
            bps.forEach(bp => {
                if (!bp.verified && bp.line < this._sourceLines.length) {
                    const srcLine = this._sourceLines[bp.line].trim();
                    if (srcLine.length === 0 || srcLine.indexOf('+') === 0) {
                        bp.line++;
                    }
                    if (srcLine.indexOf('-') === 0) {
                        bp.line--;
                    }
                    if (srcLine.indexOf('lazy') < 0) {
                        bp.verified = true;
                        this.sendEvent('breakpointValidated', bp);
                    }
                }
            });
        }
    }
    fireEventsForLine(ln, stepEvent) {
        if (this._noDebug) {
            return false;
        }
        const line = this._sourceLines[ln].trim();
        const matches = /log\((.*)\)/.exec(line);
        if (matches && matches.length === 2) {
            this.sendEvent('output', matches[1], this._sourceFile, ln, matches.index);
        }
        const words = line.split(" ");
        for (const word of words) {
            if (this._breakAddresses.has(word)) {
                this.sendEvent('stopOnDataBreakpoint');
                return true;
            }
        }
        const matches2 = /exception\((.*)\)/.exec(line);
        if (matches2 && matches2.length === 2) {
            const exception = matches2[1].trim();
            if (this._namedException === exception) {
                this.sendEvent('stopOnException', exception);
                return true;
            }
            else {
                if (this._otherExceptions) {
                    this.sendEvent('stopOnException', undefined);
                    return true;
                }
            }
        }
        else {
            if (line.indexOf('exception') >= 0) {
                if (this._otherExceptions) {
                    this.sendEvent('stopOnException', undefined);
                    return true;
                }
            }
        }
        const breakpoints = this._breakPoints.get(this._sourceFile);
        if (breakpoints) {
            const bps = breakpoints.filter(bp => bp.line === ln);
            if (bps.length > 0) {
                this.sendEvent('stopOnBreakpoint');
                if (!bps[0].verified) {
                    bps[0].verified = true;
                    this.sendEvent('breakpointValidated', bps[0]);
                }
                return true;
            }
        }
        if (stepEvent && line.length > 0) {
            this.sendEvent(stepEvent);
            return true;
        }
        return false;
    }
    sendEvent(event, ...args) {
        setImmediate(_ => {
            this.emit(event, ...args);
        });
    }
}
exports.ic10Runtime = ic10Runtime;
//# sourceMappingURL=ic10Runtime.js.map