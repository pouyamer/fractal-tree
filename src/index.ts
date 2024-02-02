const hslString = (h: number, s: number, l: number, a: number = 1) =>
  `hsl(${h}, ${s}%, ${l}%, ${a})`

const config = {
  canvas: {
    size: { width: innerWidth, height: innerHeight }
  },
  tree: {
    startingLength: 600,
    strokeWidth: 25,
    angle: Math.PI / 2,
    // how much to branch
    branchFraction: 0.6
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
  if (count === 1) {
    return [
      {
        point: getNewPoint(startingPoint, midAngle, length),
        angle: midAngle
      }
    ]
  }

  if (count === 2) {
    return [
      {
        point: getNewPoint(startingPoint, midAngle - angle / 2, length),
        angle: midAngle - angle / 2
      },
      {
        point: getNewPoint(startingPoint, midAngle + angle / 2, length),
        angle: midAngle + angle / 2
      }
    ]
  }
  if (count === 3) {
    return [
      {
        point: getNewPoint(startingPoint, midAngle - angle / 2, length),
        angle: midAngle - angle / 2
      },
      {
        point: getNewPoint(startingPoint, midAngle + angle / 2, length),
        angle: midAngle + angle / 2
      },
      {
        point: getNewPoint(startingPoint, midAngle, length),
        angle: midAngle
      }
    ]
  }
  throw new Error()
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
  branchCount: number
) => {
  if (length < 2) {
    return
  }
  const pointConfigTuples = createBranchPoints(
    startingPoint,
    angle,
    length * fraction,
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
      2
    )
  })
}

// a recursive function that draws the fractal tree
// using the iterations above

const main = () => {
  const { startingLength, strokeWidth: treeStrokeWidth } = config.tree

  let startingPoint = new Point(0, -canvasSize.height / 2)

  ctx.strokeStyle = hslString(0, 75, 30)

  makeFractalTree(
    startingPoint,
    config.tree.angle,
    startingLength,
    branchToTreeFraction,
    treeStrokeWidth,
    PI / 2,
    1
  )
}

// app starts here
main()
