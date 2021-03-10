import React, { useState } from 'react';

const ConwaysGridComponent = ({ randomResult }) => {
    const SIZE = 20
    const PADDING_FIELDS = 7;
    const NUM_ROWS = PADDING_FIELDS + 9 + PADDING_FIELDS;
    const NUM_COLS = PADDING_FIELDS + 9 + PADDING_FIELDS;
    let counter = 0;

    // counts the number of the dark squares
    const countDarkSquare = (grid) => {
        let dark = 0;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                if (grid[i][j] === 1) {
                    dark++;
                }
            }
        }
        return dark;
    }

    //check the Rules of Conway's Game of Life
    const checkRules = (i, j) => {
        const width = grid.length;
        const height = grid[0].length;
        const iLess = i - 1 < 0 ? width - 1 : i - 1;
        const iBigger = i + 1 >= width ? 0 : i + 1;
        const jLess = j - 1 < 0 ? height - 1 : j - 1;
        const jBigger = j + 1 >= height ? 0 : j + 1;
        const current = grid[i][j];

        const numberOfNeighbours =
            grid[iLess][jLess] +
            grid[iLess][j] +
            grid[iLess][jBigger] +
            grid[i][jLess] +
            grid[i][jBigger] +
            grid[iBigger][jLess] +
            grid[iBigger][j] +
            grid[iBigger][jBigger]
        if (current === 1 && (numberOfNeighbours === 2 || numberOfNeighbours === 3)) {
            return 1;
        }
        if (current === 0 && numberOfNeighbours === 3) {
            return 1;
        }
        return 0;
    }

    //Replaces the old grid with anew one when the player clicks on
    // Play Button
    const startPlaying = () => {
        const newRows = [];
        for (let i = 0; i < NUM_ROWS; i++) {
            const newCols = [];
            newRows.push(newCols);
            for (let j = 0; j < NUM_COLS; j++) {
                newCols.push(checkRules(i, j));
            }
        }
        setGrid(newRows);
    }

    const simplify = (num) => {
        if (num % 2 === 1) {
            return 1;
        }
        return 0;
    }

    //Hook to initialize the grid based on the random number.
    const [grid, setGrid] = useState(() => {
        const rows = [];
        for (let i = 0; i < NUM_ROWS; i++) {
            const cols = [];
            rows.push(cols);
            for (let j = 0; j < NUM_COLS; j++) {
                if (i < PADDING_FIELDS || i >= NUM_ROWS - PADDING_FIELDS || j < PADDING_FIELDS || j >= NUM_COLS - PADDING_FIELDS) {
                    cols.push(0)
                    continue;
                }
                cols.push(simplify(randomResult[counter]));
                counter++;
            }
        }
        return rows;
    });

    return (
        <div>
            <p>Dark:  {countDarkSquare(grid)} </p>
            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${NUM_COLS}, ${SIZE}px)`
            }}>
                {grid.map((row, i) =>
                    row.map((col, j) => (
                        <div key={`${i}+${j}`}
                            style={{
                                width: SIZE,
                                height: SIZE,
                                backgroundColor: grid[i][j] === 1 ? "grey" : "white",
                                border: "solid 1px black",
                            }}>
                        </div>
                    ))
                )}
            </div>

            <button
                type="submit"
                className="btn btn-success btn-lg"
                onClick={(event) => {
                    event.preventDefault()
                    startPlaying()
                }}> Start Playing
            </button>
        </div>
    )
}
export default ConwaysGridComponent;