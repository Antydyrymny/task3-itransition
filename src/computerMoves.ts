export default class ComputerMoves {
    public makeAMove(args: string[]): [number, string] {
        const index = Math.floor(Math.random() * args.length);
        return [index, args[index]];
    }
}
