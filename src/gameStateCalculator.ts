export type GameStateType = 'Win' | 'Draw' | 'Lose';
export type GameLog = {
    rules: string[];
    playerMoveInd: number;
    computerMoveInd: number;
    result: GameStateType;
    time: string;
};
export default class GameStateCalculator {
    private half: number;

    constructor(argsLen: number) {
        this.half = (argsLen - 1) / 2;
    }

    public resolveGame(computerMoveInd: number, playerMoveInd: number): GameStateType {
        if (playerMoveInd === computerMoveInd) return 'Draw';
        else if (playerMoveInd < computerMoveInd) {
            return computerMoveInd - playerMoveInd <= this.half ? 'Win' : 'Lose';
        } else return playerMoveInd - computerMoveInd <= this.half ? 'Lose' : 'Win';
    }

    public logResult(
        gameRules: string[],
        computerMoveInd: number,
        playerMoveInd: number
    ): GameLog {
        const result = this.resolveGame(computerMoveInd, playerMoveInd);
        return {
            rules: gameRules,
            playerMoveInd,
            computerMoveInd,
            result,
            time: new Date().toISOString(),
        };
    }
}
