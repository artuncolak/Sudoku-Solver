import React, { useEffect, useState } from "react";
import { Row, Col, Button, FormCheck, Card } from "react-bootstrap";
import Board from "./Board";
import sudokuService, { EMPTY_GRID, EMPTY_START_GRID } from "../sudokuService";
import storageService from "../storageService";

export default function SudokuSolver() {
  const [grid, setGrid] = useState(EMPTY_GRID);
  const [startGrid, setStartGrid] = useState(EMPTY_START_GRID);
  const [isGridDisabled, setIsGridDisabled] = useState(false);
  const [isShowProcessChecked, setIsShowProcessChecked] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const progressSpeed = 5;

  useEffect(() => {
    const storageBoard = storageService.getBoard();
    if (storageBoard) setGrid(storageBoard);
  }, []);

  const handleValueChange = (e, id) => {
    const { value } = e.target;
    if ((value <= 9 && value > 0) || value === "") {
      const position = id.split(",");
      const newGrid = grid.map((arr) => arr.slice());
      if (value === "") newGrid[position[0]][position[1]] = 0;
      else newGrid[position[0]][position[1]] = Number(value);
      setGrid(newGrid);
      storageService.setBoard(newGrid);
    }
  };

  const showProgress = async (progress) => {
    setIsGridDisabled(true);
    for (const grid of progress) {
      setGrid(grid);
      await new Promise((resolve) => setTimeout(resolve, progressSpeed));
    }
    setIsSolved(true);
    setIsSolving(false);
  };

  const handleSolveButtonClicked = () => {
    setIsSolving(true);
    setIsSolved(false);
    setStartGrid(grid.map((arr) => arr.slice()));
    const progress = sudokuService.solve(grid);
    if (isShowProcessChecked) {
      showProgress(progress);
    } else {
      setIsGridDisabled(true);
      setGrid(progress[progress.length - 1]);
      setIsSolved(true);
      setIsSolving(false);
    }
  };

  const reset = () => {
    setGrid(EMPTY_GRID);
    setStartGrid(EMPTY_START_GRID);
    setIsGridDisabled(false);
    setIsSolved(false);
    storageService.setBoard(EMPTY_GRID());
  };

  const undo = () => {
    setIsGridDisabled(false);
    setGrid(startGrid);
    setStartGrid(EMPTY_START_GRID);
    setIsSolved(false);
  };

  return (
    <Row className="mt-4">
      <Col sm={8} className="mb-5">
        <Board
          startGrid={startGrid}
          grid={grid}
          onChange={handleValueChange}
          disabled={isGridDisabled}
        />
      </Col>
      <Col lg className="mb-5">
        <Card className="shadow">
          <Card.Body>
            <Button
              variant="dark"
              disabled={isSolving}
              onClick={() => {
                reset();
                const randomGrid = sudokuService.getRandomExample();
                setGrid(randomGrid);
                storageService.setBoard(randomGrid);
              }}
            >
              Example Board
            </Button>
            <br />
            {isSolving ? (
              <Button
                className="mt-3"
                variant="dark"
                onClick={() => window.location.reload()}
              >
                Stop
              </Button>
            ) : (
              <Button
                className="mt-3"
                variant="dark"
                onClick={handleSolveButtonClicked}
              >
                Solve
              </Button>
            )}
            <FormCheck
              className="mt-3"
              type="checkbox"
              label="Show solving process"
              disabled={isSolving}
              checked={isShowProcessChecked}
              onChange={(e) => setIsShowProcessChecked(e.target.checked)}
            />
            {isShowProcessChecked ? (
              <p className="mt-3 text-danger">
                If you show solving process on difficult sudoku puzzles it can
                take very long time. Uncheck show solving process if you wanna
                solve difficult puzzles.
              </p>
            ) : (
              ""
            )}
            <Button
              className="mt-3 mr-1"
              variant="dark"
              disabled={isSolving}
              onClick={reset}
            >
              Clear
            </Button>
            <Button
              className="mt-3 ml-1"
              variant="dark"
              disabled={!isSolved}
              onClick={undo}
            >
              <i className="fas fa-undo" />
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
