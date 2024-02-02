const hslString = (h: number, s: number, l: number, a: number = 1) =>
  `hsl(${h}, ${s}%, ${l}%, ${a})`

const config = {
  canvas: {
    size: { width: innerWidth, height: innerHeight }
  },
  tree: {
    startingLength: 300,
    strokeWidth: 20,
    angle: Math.PI / 3,
    // how much to branch
    branchFraction: 0.7
  }
}

const canvas = document.querySelector(".canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
const { size: canvasSize } = config.canvas

canvas.height = canvasSize.height
canvas.width = canvasSize.width

// destructuring
const { PI } = Math
const { branchFraction: branchToTreeFraction } = config.tree

type PointType = {
  x: number
  y: number
}

class Point {
  x: number
  y: number
  cX: number
  cY: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    // canvas x and y:
    this.cX = x + canvas.width / 2
    this.cY = -y + canvas.height / 2
  }
}

const getNewPoint = (startingPoint: Point, angle: number, distance: number) => {
  return new Point(
    startingPoint.x + distance * Math.cos(angle),
    startingPoint.y + distance * Math.sin(angle)
  )
}

const drawLine = (startingPoint: Point, endPoint: Point) => {
  ctx.beginPath()
  ctx.moveTo(startingPoint.cX, startingPoint.cY)
  ctx.lineTo(endPoint.cX, endPoint.cY)
  ctx.stroke()
}

const createBranchPoints = (
  startingPoint: Point,
  angle: number,
  length: number,
  midAngle: number = PI / 2
) => {
  let branches = []
  const firstBranchPoint = getNewPoint(
    startingPoint,
    midAngle - angle / 2,
    length
  )

  const endBranchPoint = getNewPoint(
    startingPoint,
    midAngle + angle / 2,
    length
  )

  branches.push(firstBranchPoint)
  branches.push(endBranchPoint)

  return branches
}

const drawBranches = (startingPoint: Point, branchPoints: Point[], hue = 0) => {
  ctx.strokeStyle = hslString(hue, 75, 30)

  for (let point of branchPoints) {
    drawLine(startingPoint, point)
  }
}

const makeFractalTree = (
  startingPoint: Point,
  angle: number,
  length: number,
  fraction: number,
  strokeWidth: number,
  midAngle: number,
  hue = 20
) => {
  if (length < 3) {
    return
  }
  const branches = createBranchPoints(
    startingPoint,
    angle * 1.2,
    length * fraction,
    midAngle
  )

  ctx.lineWidth = strokeWidth
  drawBranches(startingPoint, branches, hue)

  const firstBranchingAngle = midAngle - angle / 2
  const endBranchingAngle = midAngle + angle / 2

  // make two lines above using atan with correct angles

  makeFractalTree(
    branches[0],
    angle,
    length * fraction,
    fraction,
    Math.max(strokeWidth - 1, 1),
    firstBranchingAngle,
    hue + (20 * length) / config.tree.startingLength
  )

  makeFractalTree(
    branches[1],
    angle,
    length * fraction,
    fraction,
    Math.max(strokeWidth - 1, 1),
    endBranchingAngle,
    hue + (20 * length) / config.tree.startingLength
  )
}

// a recursive function that draws the fractal tree
// using the iterations above

const main = () => {
  const { startingLength, strokeWidth: treeStrokeWidth } = config.tree

  // the base
  let startingPoint = new Point(0, -canvasSize.height / 2)
  let endPoint = getNewPoint(startingPoint, PI / 2, startingLength)

  ctx.strokeStyle = hslString(0, 75, 30)
  ctx.lineWidth = treeStrokeWidth
  drawLine(startingPoint, endPoint)

  startingPoint = endPoint
  makeFractalTree(
    startingPoint,
    config.tree.angle,
    startingLength,
    branchToTreeFraction,
    treeStrokeWidth / 2,
    PI / 2
  )
}

// app starts here
main()
