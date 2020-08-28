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

const checkSolution = (maze, start, end, solution) => {
    // returns array of solution coordinates
    // ['incomplete', [...]]
    // ['walled', [...]]
    // ['success', [...]]
}

const isSolutionValid = (maze, solution) => {
    // returns false if solution is not "code" or maze is not a maze
    // returns true if maze and solution are valid
    if (!maze.length || !solution.length) return false
    
    let solutionLowerCase = solution.toLowerCase()
    let cleanString = solutionLowerCase.replace(/\s/g, "")
    const solutionArr = cleanString.split(",")

    console.log(solutionArr)

    for (let element of solutionArr) {
        const set = new Set(["d", "u", "l", "r"])
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
    isSolutionValid
}

//test
// let sampleMaze = generateMaze(5,5)
// console.log(isSolutionValid(sampleMaze[0], "D,d ,d,d,       d,l oop (1ilhiluh - d)"))

// console.log(isValidLoop("loop(3[3-d)"))