const fs = require("fs");
var callerId = require('caller-id');
class ic10Error {
    constructor(caller, code, message, obj, lvl = 0) {
        this.message = message;
        this.code = code;
        this.obj = obj;
        this.lvl = lvl;
        this.className = caller?.typeName ?? '';
        this.functionName = caller?.functionName ?? caller?.methodName ?? '';
        this.line = caller?.lineNumber ?? 0;
    }
    getCode() {
        return this.code;
    }
    getMessage() {
        return this.message;
    }
}
var Execution = {
    error(code, message, obj) {
        var caller = callerId.getData();
        return new ic10Error(caller, code, message, obj, 0);
    },
    display: function (e) {
        if (e instanceof ic10Error) {
            var string = `[${e.functionName}:${e.line}] (${e.code}) - ${e.message}`;
            switch (e.lvl) {
                case 0:
                    console.error(string, e.obj);
                    break;
                case 1:
                    console.warn(string, e.obj);
                    break;
                case 2:
                    console.info(string, e.obj);
                    break;
                case 3:
                default:
                    console.log(string, e.obj);
                    break;
                    return null;
            }
        }
        else {
            console.log(e);
        }
    }
};
class Environ {
    constructor() {
        this.d0 = new Device();
        this.d1 = new Device();
        this.d2 = new Device();
        this.d3 = new Device();
        this.d4 = new Device();
        this.d5 = new Device();
        this.db = new Chip();
    }
    randomize() {
        for (const x in this) {
            if (this[x] instanceof Device) {
                this[x].randomize();
            }
        }
    }
}
class Memory {
    constructor() {
        this.cells = new Array(15);
        for (let i = 0; i < 15; i++) {
            this.cells[i] = new MemoryCell();
        }
    }
    cell(cell, val = null) {
        if (typeof cell === "string") {
            const regex = /^r(0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17)$/;
            let m = regex.exec(cell);
            console.log(m);
            if (m === null)
                throw Execution.error(0, 'Unknown cell', cell);
            if (val === null)
                return this.cells[m[1]];
        }
        if (typeof cell === "number") {
            if (cell >= 18)
                throw Execution.error(0, 'Unknown cell', cell);
            if (val === null)
                return this.cells[cell];
        }
    }
}
class MemoryCell {
    constructor() {
        this.value = null;
    }
    get() {
        return this.value;
    }
    set(value) {
        this.value = value;
    }
}
class ConstantCell {
    constructor(value) {
        this.value = value;
    }
    get() {
        return this.value;
    }
}
class Device {
    constructor() {
        this.On = false;
        this.Power = false;
        this.Error = false;
        this.Activate = false;
        this.Setting = null;
        this.RequiredPower = 0;
        this.ClearMemory = false;
        this.Lock = false;
        this.Slots = [];
        this.RecipeHash = -128473777;
        this.Flour = 0;
        this.Fenoxitone = 0;
        this.Milk = 0;
        this.Egg = 0;
        this.Iron = 0;
        this.Gold = 0;
        this.Carbon = 0;
        this.Uranium = 0;
        this.Copper = 0;
        this.Steel = 0;
        this.Hydrocarbon = 0;
        this.Silver = 0;
        this.Nickel = 0;
        this.Lead = 0;
        this.Electrum = 0;
        this.Invar = 0;
        this.Constantan = 0;
        this.Solder = 0;
        this.Plastic = 0;
        this.Silicon = 0;
        this.Salicylic = 0;
        this.Alcohol = 0;
        this.Oil = 0;
        this.Potato = 0;
        this.Tomato = 0;
        this.Rice = 0;
        this.Pumpkin = 0;
        this.Yellow = 0;
        this.Red = 0;
        this.Orange = 0;
        this.Green = 0;
        this.Blue = 0;
    }
    randomize() {
        this.On = Boolean(Math.abs(Math.round(Math.random())));
        this.Power = Boolean(Math.abs(Math.round(Math.random())));
        this.Error = Boolean(Math.abs(Math.round(Math.random())));
        this.Activate = Boolean(Math.abs(Math.round(Math.random())));
        this.ClearMemory = false;
        this.Flour = Math.abs(Math.round(Math.random() * 100));
        this.Fenoxitone = Math.abs(Math.round(Math.random() * 100));
        this.Milk = Math.abs(Math.round(Math.random() * 100));
        this.Egg = Math.abs(Math.round(Math.random() * 100));
        this.Iron = Math.abs(Math.round(Math.random() * 100));
        this.Gold = Math.abs(Math.round(Math.random() * 100));
        this.Carbon = Math.abs(Math.round(Math.random() * 100));
        this.Uranium = Math.abs(Math.round(Math.random() * 100));
        this.Copper = Math.abs(Math.round(Math.random() * 100));
        this.Steel = Math.abs(Math.round(Math.random() * 100));
        this.Hydrocarbon = Math.abs(Math.round(Math.random() * 100));
        this.Silver = Math.abs(Math.round(Math.random() * 100));
        this.Nickel = Math.abs(Math.round(Math.random() * 100));
        this.Lead = Math.abs(Math.round(Math.random() * 100));
        this.Electrum = Math.abs(Math.round(Math.random() * 100));
        this.Invar = Math.abs(Math.round(Math.random() * 100));
        this.Constantan = Math.abs(Math.round(Math.random() * 100));
        this.Solder = Math.abs(Math.round(Math.random() * 100));
        this.Plastic = Math.abs(Math.round(Math.random() * 100));
        this.Silicon = Math.abs(Math.round(Math.random() * 100));
        this.Salicylic = Math.abs(Math.round(Math.random() * 100));
        this.Alcohol = Math.abs(Math.round(Math.random() * 100));
        this.Oil = Math.abs(Math.round(Math.random() * 100));
        this.Potato = Math.abs(Math.round(Math.random() * 100));
        this.Tomato = Math.abs(Math.round(Math.random() * 100));
        this.Rice = Math.abs(Math.round(Math.random() * 100));
        this.Pumpkin = Math.abs(Math.round(Math.random() * 100));
        this.Yellow = Math.abs(Math.round(Math.random() * 100));
        this.Red = Math.abs(Math.round(Math.random() * 100));
        this.Orange = Math.abs(Math.round(Math.random() * 100));
        this.Green = Math.abs(Math.round(Math.random() * 100));
        this.Blue = Math.abs(Math.round(Math.random() * 100));
    }
    get(variable) {
        if (variable in this) {
            return this[variable];
        }
        else {
            throw Execution.error(0, 'Unknown variable', variable);
        }
    }
    set(variable, value) {
        if (variable in this) {
            this[variable] = value;
        }
        else {
            throw Execution.error(0, 'Unknown variable', variable);
        }
    }
}
class Chip extends Device {
    constructor() {
        super();
        this.Slots = [];
        this.Slots.push(new Slot());
    }
}
class Slot {
    constructor() {
        this.Occupied = true;
        this.OccupantHash = "";
        this.Quantity = 0;
        this.Damage = 0;
        this.Class = "";
        this.MaxQuantity = 1;
        this.PrefabHash = "";
    }
}
class InterpreterIc10 {
    constructor(code) {
        this.code = code;
        this.tickTime = 200;
        this.environ = new Environ();
        this.variables = {};
        this.memory = new Memory();
        this.constants = {};
        this.labels = {};
        this.init();
    }
    init() {
        for (let i = 0; i < 15; i++) {
            this.variables["r" + i] = this.memory.cell(i);
        }
        this.lines = text.split("\r\n");
        this.commands = this.lines
            .filter((line) => line !== "")
            .map((line) => {
            const args = line.trim().split(/ +/);
            const command = args.shift();
            return { command, args };
        });
    }
    run() {
        this.position = 0;
        while (this.position < this.commands.length) {
            let { command, args } = this.commands[this.position];
            this.position++;
            if (command.match(/^\w+:$/)) {
                this.labels[command.replace(":", "")] = this.position;
            }
        }
        this.position = 0;
        console.log(this.labels);
        this.interval = setInterval(() => {
            if (!this.prepareLine()) {
                clearInterval(this.interval);
            }
        }, this.tickTime);
    }
    prepareLine() {
        this.environ.randomize();
        let { command, args } = this.commands[this.position];
        let isComment = command.startsWith("#");
        for (const argsKey in args) {
            let a = parseFloat(args[argsKey]);
            if (!isNaN(a)) {
                args[argsKey] = a;
            }
        }
        try {
            if (command === "#die")
                return false;
            command = command.replace("#", "_");
            if (command in this) {
                this[command](...args);
                this.__debug(command, args);
            }
        }
        catch (e) {
            Execution.display(e);
        }
        this.position++;
        return isComment && this.position < this.commands.length
            ? this.prepareLine()
            : this.position < this.commands.length;
    }
    __issetConst(x) {
        return x in this.constants;
    }
    __issetVar(x) {
        return x in this.variables;
    }
    __issetLabel(x) {
        return x in this.labels;
    }
    __issetEntity(x) {
        return this.__issetVar(x) || this.__issetConst(x);
    }
    __issetPort(x) {
        return x in this.environ;
    }
    __getPort(x) {
        if (this.__issetPort(x)) {
            return this.environ[x];
        }
        else if (this.__issetVar(x) && this.variables[x] instanceof Device) {
            return this.variables[x];
        }
        else {
            throw Execution.error(0, 'Unknown port', x);
        }
    }
    __getVar(x) {
        if (this.__issetVar(x)) {
            return this.variables[x].get();
        }
        else if (this.__issetConst(x)) {
            return this.constants[x].get();
        }
        else {
            throw Execution.error(0, 'Undefined Variable', x);
        }
    }
    __setVar(x, value) {
        if (this.__issetVar(x)) {
            this.variables[x].set(value);
        }
        else {
            throw Execution.error(0, 'Undefined Variable', x);
        }
    }
    __jump(x) {
        if (this.__issetLabel(x)) {
            this.position = this.labels[x] - 1;
        }
        else {
            throw Execution.error(0, ' Undefined label', x);
        }
    }
    __ajump(x) {
        this.position += x - 1;
    }
    __get() {
        return;
    }
    define(op1, op2, op3, op4) {
        this.constants[op1] = new ConstantCell(op2);
    }
    alias(op1, op2, op3, op4) {
        if (op2.match(/^r\d{1,2}$/) && op2 in this.memory) {
            this.variables[op1] = this.variables[op2];
            this.variables[op2] = this.variables[op2];
        }
        else if (op2.match(/^d\d{1}$/) && op2 in this.environ) {
            this.variables[op1] = this.environ[op2];
            this.variables[op2] = this.environ[op2];
        }
        else {
            throw Execution.error(0, 'Unknown Register', op2);
        }
    }
    l(op1, op2, op3, op4) {
        this.__setVar(op1, this.__getPort(op2).get(op3));
    }
    s(op1, op2, op3, op4) {
        this.__getPort(op1).set(op2, op3);
    }
    move(op1, op2, op3, op4) {
        this.__setVar(op1, isNaN(op2) ? op2 : Number(op2));
    }
    add(op1, op2, op3, op4) {
        this.__setVar(op1, this.__getVar(op2) + this.__getVar(op3));
    }
    sub(op1, op2, op3, op4) {
        this.__setVar(op1, this.__getVar(op2) - this.__getVar(op3));
    }
    mul(op1, op2, op3, op4) {
        this.__setVar(op1, this.__getVar(op2) * this.__getVar(op3));
    }
    div(op1, op2, op3, op4) {
        this.__setVar(op1, this.__getVar(op2) / this.__getVar(op3));
    }
    mod(op1, op2, op3, op4) {
        this.__setVar(op1, Math.abs(this.__getVar(op2) % this.__getVar(op3)));
    }
    sqrt(op1, op2, op3, op4) {
        this.__setVar(op1, Math.sqrt(this.__getVar(op2)));
    }
    round(op1, op2, op3, op4) {
        this.__setVar(op1, Math.round(this.__getVar(op2)));
    }
    trunc(op1, op2, op3, op4) {
        this.__setVar(op1, Math.trunc(this.__getVar(op2)));
    }
    ceil(op1, op2, op3, op4) {
        this.__setVar(op1, Math.ceil(this.__getVar(op2)));
    }
    floor(op1, op2, op3, op4) {
        this.__setVar(op1, Math.floor(this.__getVar(op2)));
    }
    max(op1, op2, op3, op4) {
        if (op3 > op2) {
            this.__setVar(op1, this.__getVar(op3));
        }
        else {
            this.__setVar(op1, this.__getVar(op2));
        }
    }
    min(op1, op2, op3, op4) {
        if (op2 > op3) {
            this.__setVar(op1, this.__getVar(op3));
        }
        else {
            this.__setVar(op1, this.__getVar(op2));
        }
    }
    abs(op1, op2, op3, op4) {
        this.__setVar(op1, Math.abs(this.__getVar(op2)));
    }
    log(op1, op2, op3, op4) {
        this.__setVar(op1, Math.log(this.__getVar(op2)));
    }
    exp(op1, op2, op3, op4) {
        this.__setVar(op1, Math.exp(this.__getVar(op2)));
    }
    rand(op1, op2, op3, op4) {
        this.__setVar(op1, Math.random());
    }
    sin(op1, op2, op3, op4) {
        this.__setVar(op1, Math.sin(op2));
    }
    cos(op1, op2, op3, op4) {
        this.__setVar(op1, Math.cos(op2));
    }
    tan(op1, op2, op3, op4) {
        this.__setVar(op1, Math.tan(op2));
    }
    asin(op1, op2, op3, op4) {
        this.__setVar(op1, Math.asin(op2));
    }
    acos(op1, op2, op3, op4) {
        this.__setVar(op1, Math.acos(op2));
    }
    atan(op1, op2, op3, op4) {
        this.__setVar(op1, Math.atan(op2));
    }
    slt(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 < op3));
    }
    sltz(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 < 0));
    }
    sgt(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 > op3));
    }
    sgtz(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 > 0));
    }
    sle(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 <= op3));
    }
    slez(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 <= 0));
    }
    sge(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 >= op3));
    }
    sgez(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 >= 0));
    }
    seq(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 == op3));
    }
    seqz(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 == 0));
    }
    sne(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 != op3));
    }
    snez(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 != 0));
    }
    sap(op1, op2, op3, op4 = 1) {
        this.__setVar(op1, Number(this.__ap(op2, op3, op4)));
    }
    sapz(op1, op2, op3, op4 = 1) {
        this.__setVar(op1, Number(this.__ap(op2, 0, op4)));
    }
    sna(op1, op2, op3, op4 = 1) {
        this.__setVar(op1, Number(this.__na(op2, op3, op4)));
    }
    snaz(op1, op2, op3, op4 = 1) {
        this.__setVar(op1, Number(this.__na(op2, 0, op4)));
    }
    sdse(op1, op2, op3, op4 = 1) {
        this.__setVar(op1, this.__dse(op2));
    }
    sdns(op1, op2, op3, op4 = 1) {
        this.__setVar(op1, this.__dns(op2));
    }
    __dse(x) {
        return 1;
    }
    __dns(x) {
        return 1;
    }
    __ap(x, y, d = 1) {
        return Math.abs(1 - x / y) <= d;
    }
    __na(x, y, d = 1) {
        return Math.abs(1 - x / y) > d;
    }
    and(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 && op3));
    }
    or(op1, op2, op3, op4) {
        this.__setVar(op1, Number(op2 || op3));
    }
    xor(op1, op2, op3, op4) {
        this.__setVar(op1, Number((op2 || op3) && !(op2 && op3)));
    }
    nor(op1, op2, op3, op4) {
        this.__setVar(op1, Number(!(op2 || op3)));
    }
    blt(op1, op2, op3, op4) {
        if (op1 < op2) {
            this.__jump(op3);
        }
    }
    bltz(op1, op2, op3, op4) {
        if (op1 < 0) {
            this.__jump(op3);
        }
    }
    ble(op1, op2, op3, op4) {
        if (op1 <= op2) {
            this.__jump(op3);
        }
    }
    blez(op1, op2, op3, op4) {
        if (op1 <= 0) {
            this.__jump(op3);
        }
    }
    bge(op1, op2, op3, op4) {
        if (op1 >= op2) {
            this.__jump(op3);
        }
    }
    bgez(op1, op2, op3, op4) {
        if (op1 >= 0) {
            this.__jump(op3);
        }
    }
    bgt(op1, op2, op3, op4) {
        if (op1 > op2) {
            this.__jump(op3);
        }
    }
    bgtz(op1, op2, op3, op4) {
        if (op1 > 0) {
            this.__jump(op3);
        }
    }
    beq(op1, op2, op3, op4) {
        if (op1 == op2) {
            this.__jump(op3);
        }
    }
    beqz(op1, op2, op3, op4) {
        if (op1 == 0) {
            this.__jump(op3);
        }
    }
    bne(op1, op2, op3, op4) {
        if (op1 != op2) {
            this.__jump(op3);
        }
    }
    bnez(op1, op2, op3, op4) {
        if (op1 != 0) {
            this.__jump(op3);
        }
    }
    bap(op1, op2, op3, op4) {
        if (this.__ap(op1, op2, op3)) {
            this.__jump(op4);
        }
    }
    bapz(op1, op2, op3, op4) {
        if (this.__ap(op1, op2, op3)) {
            this.__jump(op4);
        }
    }
    bna(op1, op2, op3, op4) {
        if (this.__na(op1, op2, op3)) {
            this.__jump(op4);
        }
    }
    bnaz(op1, op2, op3, op4) {
        if (this.__na(op1, op2, op3)) {
            this.__jump(op4);
        }
    }
    bdse(op1, op2, op3, op4) {
        if (this.__dse(op1)) {
            this.__jump(op2);
        }
    }
    bdns(op1, op2, op3, op4) {
        if (this.__dns(op1)) {
            this.__jump(op2);
        }
    }
    yield(op1, op2, op3, op4) {
    }
    sleep(op1, op2, op3, op4) {
    }
    j(op1, op2, op3, op4) {
        this.__jump(op1);
    }
    _log() {
        var out = [];
        for (const argumentsKey in arguments) {
            if (this.__issetEntity(arguments[argumentsKey])) {
                out.push(this.__getVar(arguments[argumentsKey]));
            }
            else {
                out.push(arguments[argumentsKey]);
            }
        }
        console.log(...out);
    }
    __debug(p, iArguments) {
        console.debug(...arguments);
    }
}
const text = fs.readFileSync(".ic10", "utf8");
var interpreterIc10 = new InterpreterIc10(text);
interpreterIc10.run();
//# sourceMappingURL=interpreter.js.map