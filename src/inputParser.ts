export default class InputParser {
    private makeErrorMsg(msg: string): void {
        const argsError =
            'Error: Arguments must be unique, and their number should be odd and greater than 2\n';
        const argsExample = '\nExample arguments: rock, paper, scissors';
        console.log(`${argsError}${msg}${argsExample}`);
    }

    public inputIsValid(args: string[]) {
        if (args.length < 3) {
            this.makeErrorMsg('Please, enter at least 3 arguments');
            process.exit();
        } else if (args.length % 2 === 0) {
            this.makeErrorMsg('Please, enter the odd number of arguments');
            process.exit();
        }
        const argsSet = new Set(args);
        if (argsSet.size !== args.length) {
            this.makeErrorMsg('Please, make sure all arguments are unique');
            process.exit();
        }
    }
}
