import Maze from "./maze.js";
import Solver from "./solver.js";

const elCanvas = document.getElementById('canvas');
const ctx = elCanvas.getContext("2d");
const elStartBtn = document.getElementById('start');
const elMazeMenu = document.getElementById('maze-menu');
const elGenerateCanvastAutomaticBtn = document.getElementById('generate-maze-automatic')
const elGenerateCanvastManualBtn = document.getElementById('generate-maze-manual')
const elResetBtn = document.getElementById('reset-maze')
const elSolveMaze = document.getElementById('solve-maze')
const elSizeInput = document.getElementById("size")
let maze = null

function updateMazeSize() {
    elCanvas.classList.remove('show')
    elMazeMenu.classList.remove('show')
    elStartBtn.style.display = ''
    setTimeout(() => {
        ctx.reset()
    }, 200)
}

function toggleButtonHidedShow() {
    elGenerateCanvastAutomaticBtn.classList.toggle('hidden')
    elSolveMaze.classList.toggle("hidden")
    elResetBtn.classList.toggle("hidden")
}

elSizeInput.onkeyup = () => {
    updateMazeSize()
}

elSizeInput.onchange = () => {
    updateMazeSize()
}

elStartBtn.onclick = () => {
    elCanvas.classList.toggle('show')
    elMazeMenu.classList.toggle('show')
    elStartBtn.style.display = 'none'
    setTimeout(() => {
        maze = new Maze(+elSizeInput.value, toggleButtonHidedShow);
        maze.draw({ reset: true })
    }, 250)
}
elGenerateCanvastAutomaticBtn.onclick = async () => {
    maze.generateMaze()
}

elGenerateCanvastManualBtn.onclick = () => {
    maze.generateMaze({ manual: true })
}

elResetBtn.onclick = () => {
    toggleButtonHidedShow()
    elSolveMaze.setAttribute("disabled", false)
    maze = new Maze(+elSizeInput.value, toggleButtonHidedShow);
    maze.draw({ reset: true })
    window.onkeydown = null
}

elSolveMaze.onclick = () => {
    elSolveMaze.setAttribute("disabled", false)
    const solver = new Solver(maze);

    window.onkeydown = null

    solver.initSolveMaze()
    solver.solveMaze()
}