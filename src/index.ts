import Main from './main';

const args = process.argv.slice(2);
const newGame = new Main(args);
newGame.play();
