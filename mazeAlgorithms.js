const generateMaze = (r, c) => {
    const colMax = c
    const rowMax = r
    const visited = new Array(rowMax)

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
                dfsRecursive(dRow, dCol)
            } 
        }
    }

    const fourCorners = [[1,1], [1, colMax-2], [rowMax-2, 1], [rowMax-2, colMax-2]]
    dfsRecursive(1,1)
    
    const startAndEndNodes = randomStartAndEnd(fourCorners)

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

const randomStartAndEnd = (fourCorners) => {
    const nodesLength = fourCorners.length
    let startNode = fourCorners[Math.floor(Math.random()*nodesLength)]
    let endNode = fourCorners[Math.floor(Math.random()*nodesLength)]

    while (startNode === endNode) {
        endNode = fourCorners[Math.floor(Math.random() * nodesLength)]
    }
    
    return [startNode, endNode]
} 


module.export = {
    generateMaze
}