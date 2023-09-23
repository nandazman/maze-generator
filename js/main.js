import Maze from "./maze.js";

const elCanvas = document.getElementById('canvas');
const ctx = elCanvas.getContext("2d");
const elStartBtn = document.getElementById('start');
const elMazeMenu = document.getElementById('maze-menu');
const elGenerateCanvastAutomaticBtn = document.getElementById('generate-maze-automatic')
const elGenerateCanvastManualBtn = document.getElementById('generate-maze-manual')
const elResetBtn = document.getElementById('reset-maze')
const elSizeInput = document.getElementById("size")
let maze = null

function updateMazeSize() {
    elCanvas.classList.remove('show')
    elMazeMenu.classList.remove('show')
    elStartBtn.style.display = ''
    elGenerateCanvastAutomaticBtn.removeAttribute("disabled")
    elGenerateCanvastManualBtn.removeAttribute("disabled")
    setTimeout(() => {
        ctx.reset()
    }, 200)
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
        maze = new Maze(+elSizeInput.value);
        maze.draw({ reset: true })
    }, 250)
}
elGenerateCanvastAutomaticBtn.onclick = async () => {
    maze.generateMaze()
    elGenerateCanvastAutomaticBtn.setAttribute("disabled", true)
    elGenerateCanvastManualBtn.setAttribute("disabled", true)
}

elGenerateCanvastManualBtn.onclick = () => {
    maze.generateMaze({ manual: true })
    elGenerateCanvastAutomaticBtn.setAttribute("disabled", true)
}

elResetBtn.onclick = () => {
    elGenerateCanvastAutomaticBtn.removeAttribute("disabled", false)
    elGenerateCanvastManualBtn.removeAttribute("disabled", false)
    maze = new Maze(+elSizeInput.value);
    maze.draw({ reset: true })
}
