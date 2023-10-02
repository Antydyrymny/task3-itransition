import * as readlineSync from 'readline-sync';
import InputParser from './inputParser';
import KeyGenerator from './keyGenerator';
import ComputerMoves from './computerMoves';
import HashGenerator from './hashGenerator';
import GameStateCalculator from './gameStateCalculator';
import type { GameStateType } from './gameStateCalculator';
import TableCreator from './tableCreator';

export default class Main {
    private args: string[];
    private inputParser: InputParser;
    private keyGenerator: KeyGenerator;
    private computerMovesGenerator: ComputerMoves;
    private hashGenerator: HashGenerator;
    private gameStateCalculator: GameStateCalculator;
    private tableCreator: TableCreator;
    private secretKey: string;
    private computerMoveInd: number;
    private computerMove: string;
    private playerMoveInd: number;
    private hmac: string;
    private gameResult: GameStateType;
    private tableData: string[][];

    constructor(args: string[]) {
        this.args = args;
        this.inputParser = new InputParser();
        this.keyGenerator = new KeyGenerator();
        this.computerMovesGenerator = new ComputerMoves();
        this.hashGenerator = new HashGenerator();
        this.gameStateCalculator = new GameStateCalculator(args.length);
        this.tableCreator = new TableCreator();
        this.secretKey = '';
        this.computerMoveInd = NaN;
        this.computerMove = '';
        this.playerMoveInd = NaN;
        this.hmac = '';
        this.gameResult = 'Draw';
        this.tableData = [];
    }

    public play() {
        console.log('Game Started! \n');
        this.validateInput();
        this.generateKey();
        this.makeComputerMove();
        this.generateAndShowHash();
        this.showPlayerMoves();
        this.getGameResult();
        this.showResultMessage();
        this.startCL();
    }

    private validateInput() {
        this.inputParser.inputIsValid(this.args);
    }

    private generateKey() {
        this.secretKey = this.keyGenerator.generateKey();
    }

    private makeComputerMove() {
        [this.computerMoveInd, this.computerMove] = this.computerMovesGenerator.makeAMove(
            this.args
        );
        console.log(`Computer made it's move!`);
    }

    private generateAndShowHash() {
        this.hmac = this.hashGenerator.calculateHMAC(this.secretKey, this.computerMove);
        console.log(`Generated HMAC for computer move: \n${this.hmac}`);
    }

    private getTableData() {
        this.tableData = this.tableCreator.getTableData(this.args);
    }

    private showTable() {
        if (!this.tableData.length) this.getTableData();
        this.tableCreator.logTable(this.tableData);
        this.showContinue();
    }

    private exitApp() {
        console.log('Exiting...');
        console.log('Come back next time!');
        process.exit();
    }

    private showContinue() {
        const index = readlineSync.keyInSelect(['Continue', 'Exit'], '', {
            cancel: false,
        });
        if (index === 0) {
            console.log('Continuing...\n');
            return;
        } else this.exitApp();
    }

    private showPlayerMoves() {
        const index = readlineSync.keyInSelect(
            [...this.args, 'help'],
            'Please, make a move',
            {
                cancel: 'Exit',
            }
        );
        if (index === -1) this.exitApp();
        else if (index === this.args.length) {
            this.showTable();
            this.showPlayerMoves();
        } else {
            console.log(`Selected move: ${this.args[index]}`);
            this.playerMoveInd = index;
        }
    }

    private getGameResult() {
        this.gameResult = this.gameStateCalculator.resolveGame(
            this.computerMoveInd,
            this.playerMoveInd
        );
    }

    private showResultMessage() {
        console.log(`Computer move was: ${this.computerMove}\n`);
        switch (this.gameResult) {
            case 'Win':
                console.log('Congratulations, you WIN!');
                break;
            case 'Draw':
                console.log('Game ends in a DRAW');
                break;
            case 'Lose':
                console.log('You Lose=(');
                break;
        }
        console.log(`Computer secret key was: ${this.secretKey}\n`);
    }

    private playAgain() {
        this.secretKey = '';
        this.computerMoveInd = NaN;
        this.computerMove = '';
        this.playerMoveInd = NaN;
        this.hmac = '';
        this.gameResult = 'Draw';
        const index = readlineSync.keyInSelect(['Same rules', 'New rules'], '', {
            cancel: false,
        });
        if (index === 0) {
            this.play();
        } else {
            this.args = [];
            this.tableData = [];
            this.getNewArgs();
        }
    }

    private getNewArgs() {
        this.args = readlineSync
            .question('Please, enter new arguments: ')
            .split(' ')
            .filter((word) => word !== '');
        this.play();
    }

    private showConsoleLegend() {
        console.log(`'again' to play one more round!`);
        console.log(`'help' to display the table of game states`);
        console.log(`'exit' to close the program\n`);
    }

    private startCL() {
        this.showConsoleLegend();
        const options = {
            again: this.playAgain.bind(this),
            help: () => {
                this.showTable.call(this);
                this.showConsoleLegend();
            },
            exit: this.exitApp.bind(this),
        };

        readlineSync.promptCLLoop(options);
    }
}
