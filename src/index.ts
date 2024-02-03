const hslString = (h: number, s: number, l: number, a: number = 1) =>
  `hsl(${h}, ${s}%, ${l}%, ${a})`
const randomNumber = (min: number, max: number) =>
  Math.random() * (max - min) + min

const config = {
  canvas: {
    size: { width: innerWidth, height: innerHeight }
  },
  tree: {
    length: innerHeight,
    strokeWidth: 10,
    angle: 1.3 * Math.PI,
    // how much to branch
    branchFraction: 0.5,
    midangle: Math.PI / 2,
    branchingMode: "random",
    branchCount: 3,
    randomBranchCount: {
      min: 2,
      max: 7
    }
  }
}

// TODO: find the formula for the mid angle
// TODO: Add Types for config and tree config
// TODO: Add random:
//       - angle
//       - fraction
//       - branch count
// TODO: Add UnEven Branch Distribution

// TODO: add a level determiner
// TODO: Make a fractal tree class and add methods
//       - it has:
//         - level
//         - mid angle
//         - branch count

const canvas = document.querySelector(".canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
const { size: canvasSize } = config.canvas

canvas.height = canvasSize.height
canvas.width = canvasSize.width

// destructuring
const { PI } = Math
const {
  branchFraction: branchToTreeFraction,
  branchingMode: treeBranchingMode,
  branchCount: treeBranchCount,
  randomBranchCount: { min: branchCountMin, max: branchCountMax }
} = config.tree

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

type PointAngleTupleType = {
  point: Point
  angle: number
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
  midAngle: number = PI / 2,
  count: number = 2
): PointAngleTupleType[] => {
  let branchMidangles: number[] = []
  if (count === 1) {
    branchMidangles = [midAngle]
  }

  if (count === 2) {
    branchMidangles = [midAngle - angle / 2, midAngle + angle / 2]
  }
  if (count === 3) {
    branchMidangles = [midAngle - angle / 2, midAngle, midAngle + angle / 2]
  }
  if (count === 4) {
    branchMidangles = [
      midAngle - angle / 2,
      midAngle - angle / 6,
      midAngle + angle / 6,
      midAngle + angle / 2
    ]
  }

  if (count === 5) {
    branchMidangles = [
      midAngle - angle / 2,
      midAngle - angle / 4,
      midAngle,
      midAngle + angle / 4,
      midAngle + angle / 2
    ]
  }

  if (count === 6) {
    branchMidangles = [
      midAngle - angle / 2,
      midAngle - angle / 8,
      midAngle - angle / 3,
      midAngle + angle / 3,
      midAngle + angle / 8,
      midAngle + angle / 2
    ]
  }

  if (count === 7) {
    branchMidangles = [
      midAngle - angle / 2,
      midAngle - angle / 3,
      midAngle - angle / 6,
      midAngle,
      midAngle + angle / 6,
      midAngle + angle / 3,
      midAngle + angle / 2
    ]
  }

  return branchMidangles.map(angle => {
    return { angle, point: getNewPoint(startingPoint, angle, length) }
  })
}

const drawBranches = (startingPoint: Point, branchPoints: Point[], hue = 0) => {
  ctx.strokeStyle = hslString(hue, 75, 30)

  for (let point of branchPoints) {
    drawLine(startingPoint, point)
  }
}

const determineBranchCount = () => {
  switch (treeBranchingMode) {
    case "none":
      return treeBranchCount

    case "random":
      return Math.floor(randomNumber(branchCountMin, branchCountMax))

    default:
      throw new Error("invalid branching mode")
  }
}

const makeFractalTree = (
  startingPoint: Point,
  angle: number,
  length: number,
  fraction: number,
  strokeWidth: number,
  midAngle: number,
  branchCount: number
) => {
  if (length < 2) {
    return
  }

  const pointConfigTuples = createBranchPoints(
    startingPoint,
    angle,
    length,
    midAngle,
    branchCount
  )

  const branchPoints = pointConfigTuples.map(({ point }) => point)

  ctx.lineWidth = strokeWidth
  drawBranches(startingPoint, branchPoints)

  pointConfigTuples.forEach(({ angle: paangle, point: papoint }) => {
    makeFractalTree(
      papoint,
      angle,
      length * fraction,
      fraction,
      Math.max(strokeWidth * 0.7, 1),
      paangle,
      determineBranchCount()
    )
  })
}

// a recursive function that draws the fractal tree
// using the iterations above

const main = () => {
  const { length, strokeWidth: treeStrokeWidth } = config.tree

  ctx.fillStyle = "#eee"
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

  let startingPoint = new Point(0, -canvasSize.height / 2)

  ctx.strokeStyle = hslString(0, 75, 30)

  makeFractalTree(
    startingPoint,
    config.tree.angle,
    length * branchToTreeFraction,
    branchToTreeFraction,
    treeStrokeWidth,
    config.tree.midangle,
    1
  )
}

// app starts here
main()
