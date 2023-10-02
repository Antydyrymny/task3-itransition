import { table } from 'table';
import GameStateCalculator from './gameStateCalculator';

export default class TableCreator {
    private makeRed(str: string) {
        return `\x1b[31m${str}\x1b[0m`;
    }

    private makeBlue(str: string) {
        return `\x1b[34m${str}\x1b[0m`;
    }

    public getTableData(args: string[]) {
        const gameStateCalculator = new GameStateCalculator(args.length);

        return Array.from(new Array(args.length + 1), (row, rowInd) =>
            Array.from(new Array(args.length + 1), (col, colInd) =>
                rowInd === 0 && colInd === 0
                    ? this.makeRed('v PC') + ' / ' + this.makeBlue('User >')
                    : rowInd === 0
                    ? this.makeBlue(args[colInd - 1])
                    : colInd === 0
                    ? this.makeRed(args[rowInd - 1])
                    : gameStateCalculator.resolveGame(colInd, rowInd)
            )
        );
    }

    public logTable(tableData: string[][]) {
        console.log(table(tableData));
    }
}
