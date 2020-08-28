const generateMaze = (r, c) => {
    const colMax = c
    const rowMax = r
    const visited = new Array(rowMax)
    const availableNodes = []
    for (let row = 0; row<rowMax; row++) {
        visited[row] = new Array(colMax).fill(1)
    }

    const dfsRecursive = (row, col) => {
        const directions = shuffleDirections([[0, 2], [2, 0], [-2, 0], [0, -2]])
        visited[row][col] = 0

        for (let direction of directions) {
            let dRow = row + direction[0]
            let dCol = col + direction[1]
            // check if its within bounds
            if (dRow >= 0 && dCol >= 0 && dRow < rowMax && dCol < colMax && visited[dRow][dCol] === 1 ) {
                visited[row][col] = 0
                const midRow = (row + dRow) / 2
                const midCol = (col + dCol) / 2
                visited[midRow][midCol] = 0
                availableNodes.push([row, col])
                availableNodes.push([midRow, midCol])
                dfsRecursive(dRow, dCol)
            } 
        }
    }

    dfsRecursive(1,1)
    
    const startAndEndNodes = randomStartAndEnd(availableNodes)

    return [visited, startAndEndNodes]

}


const shuffleDirections = (directions) => {
    let currentIdx = directions.length, tempVal, randomIdx

    while (0 !== currentIdx) {
        randomIdx = Math.floor(Math.random() * currentIdx)
        currentIdx--

        tempVal = directions[currentIdx]
        directions[currentIdx] = directions[randomIdx]
        directions[randomIdx] = tempVal
    }

    return directions

}

const randomStartAndEnd = (nodeList) => {
    const nodesLength = nodeList.length
    let startNodeIdx = Math.floor(Math.random()*nodesLength)
    let endNodeIdx = Math.floor(Math.random()*nodesLength)

    while (startNodeIdx === endNodeIdx) {
        endNodeIdx = Math.floor(Math.random() * nodesLength)
    }

    const startNode = nodeList[startNodeIdx], endNode = nodeList[endNodeIdx]
    
    return [startNode, endNode]
} 

const checkSolution = (maze, start, end, destructuredSolution) => {
    const directions = {
        "u": [-1, 0],
        "d": [1, 0],
        "r": [0, 1],
        "l": [0, -1]
    }
    let lastValidPosition = start
    const pathTaken = []
    for (let dir of destructuredSolution) {
        const [dRow, dCol] = directions[dir]
        const nextRow = lastValidPosition[0] + dRow
        const nextCol = lastValidPosition[1] + dCol

        if (maze[nextRow][nextCol] === 0) {
            lastValidPosition = [nextRow, nextCol]
            pathTaken.push([nextRow, nextCol])
        } else {
            return {'failure': pathTaken}
        }
    }
    return (lastValidPosition[0] === end[0] && lastValidPosition[1] === end[1])? {'success': pathTaken} : {'incomplete': pathTaken}
}

const destructureSolution = (solution) => {
    const set = new Set(["d", "u", "l", "r"])
    const destructuredSolution = []
    for (let element of solution) {
        if (!set.has(element)) {
            const loopArr = element.substring(5, element.length-1).split("-")
            const loopRep = parseInt(loopArr[0], 10)
            for (let i = 0; i<loopRep; i++) {
                destructuredSolution.push(loopArr[1])
            }
        } else {
            destructuredSolution.push(element)
        }
    }
    return destructuredSolution
}

const isSolutionValid = (maze, solution) => {
    // returns false if solution is not "code" or maze is not a maze
    // returns true if maze and solution are valid
    if (!maze.length || !solution.length) return false
    
    let solutionLowerCase = solution.toLowerCase()
    let cleanString = solutionLowerCase.replace(/\s/g, "")
    const solutionArr = cleanString.split(",")
    const set = new Set(["d", "u", "l", "r"])

    for (let element of solutionArr) {
        if (!set.has(element) && !isValidLoop(element)) return false

    }

    return true
}

const isValidLoop = loop => {
    const set = new Set(["d", "u", "l", "r"])
    if (loop.substring(0,4) !== "loop") return false
    if (loop[4] !== "(" && loop[loop.length-1] !== ")") return false
    let loopCondition = loop.substring(5, loop.length - 1)
    const loopArr = loopCondition.split("-")
    if (loopArr.length > 2) return false
    if (!isStringValidNum(loopArr[0])) return false
    if (!set.has(loopArr[1])) return false

    return true
}

const isStringValidNum = string => {
    const set = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])
    for (let i=0;i<string.length; i++) {
        if (!set.has(string[i])) return false
    }
    return true
}

module.exports = {
    generateMaze,
    isSolutionValid,
    destructureSolution,
    checkSolution
}


const maze = [
      [ 1, 1, 1, 1, 1 ],
      [ 1, 0, 1, 0, 1 ],
      [ 1, 0, 1, 0, 1 ],
      [ 1, 0, 0, 0, 1 ],
      [ 1, 1, 1, 1, 1 ]
    ],
    start = [ 1, 1 ], end = [ 1, 3 ] 

const answer = checkSolution(maze, start, end, ["d", "d", "r", "r", "u", "u"])

console.log(answer)

const answer2 = destructureSolution(["loop(4-r)", "d"])

console.log(answer2)