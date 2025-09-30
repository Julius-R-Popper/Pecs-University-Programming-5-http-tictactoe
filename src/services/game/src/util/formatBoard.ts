export function formatBoard(board: (string | null)[]) {
    let output = "";
    for (let row = 0; row < 3; row++) {
        const cells = board
            .slice(row * 3, row * 3 + 3)
            .map(cell => cell === null ? " " : cell);
        output += ` ${cells[0]} | ${cells[1]} | ${cells[2]} \n`;
        if (row < 2) {
            output += "---+---+---\n";
        }
    }
    return output;
}