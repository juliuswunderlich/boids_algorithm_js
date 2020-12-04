/*
Pseudo-Code for the algorithm
http://www.vergenet.net/~conrad/boids/pseudocode.html

Three rules of boid's algorithm:
================================

[1] Boids try to fly towards the center of mass of neighbouring boids
    -----------------------------------------------------------------
    - center of mass: average position of all boids


Pure HTML, CSS and JavaScript implementation of boids algorithm,
to simulate natural flocking behaviour.

Julius Wunderlich
*/


//TODO
/*
 * Think about how you want to handle vectors.
    -> let's go raw and use arrays
 * Finish rule 1
 */



let cvs
let context

let boidList = []
let t1, t2, t3
let c1, c2, c3


// average position of all boids
let globalCenterMass



// initializes everything
function main() {
  cvs = document.getElementById("myCanvas")
  context = cvs.getContext("2d")
  //initially clear the canvas
  context.clearRect(0, 0, cvs.width, cvs.height)

  init()

  setInterval(draw, 10)
}

// initializes all the objects
function init() {
  // x and y are starting positions
  t1 = new Triangle('t1', x = 100, y = 100, width = 60, height = 60, "blue", 2, 1)
  t2 = new Triangle('t2', x = 200, y = 100, width = 60, height = 60, "purple", 1, 4)
  t3 = new Triangle('t3', x = 300, y = 100, width = 60, height = 60, "cyan", 5,1)
  boidList.push(t1,t2,t3)



  /*
  c1 = new Circle(x = 150, y = 150, radius = 20, "red", 2,2)
  c2 = new Circle(x = 250, y = 150, radius = 20, "white", 2,4)
  c3 = new Circle(x = 350, y = 150, radius = 20, "green", 3,2)
  */
}

// main drawing function to draw all the elements
function draw() {
  context.clearRect(0, 0, cvs.width, cvs.height)
  draw_boids()
  move_boids()
}

// draws all the boids, at their x and y positions
function draw_boids() {
  for (let boid of boidList) {
    let x = boid.position[0]
    let y = boid.position[1]
    let witdh = boid.width
    let height = boid.height
    let color = boid.color

    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + width, y)
    context.lineTo(x + (width / 2), y + height)
    context.closePath()
    context.fillStyle = color
    context.fill()
  }

}

// moves all boids to new positions (according to their dx and dy attributes)
function move_boids() {
  for (let boid of boidList) {
    let x = boid.position[0]
    let y = boid.position[1]
    let witdh = boid.width
    let height = boid.height

    v1 = enforceRuleOne(boid)
    v2 = enforceRuleTwo(boid, 3)

    boid.velocity[0] = boid.velocity[0] + v1[0] + v2[0]
    boid.velocity[1] = boid.velocity[1] + v1[1] + v2[1]



    // gotta have this, to not fly out of the screen
    let dx = boid.velocity[0]
    let dy = boid.velocity[1]
    if ((x + dx + width) <= 0) {
      dx = -dx
    }
    if ((x + dx + width) >= cvs.width) {
      dx = -dx
    }
    if ((y + dy + height) <= 0) {
      dy = -dy
    }
    if ((y + dy + height) >= cvs.height) {
      dy = -dy
    }
    boid.velocity[0] = dx
    boid.velocity[1] = dy
    boid.position[0] = boid.position[0] + boid.velocity[0]
    boid.position[1] = boid.position[1] + boid.velocity[1]
  }
}


// Rule 1: Boids try to fly towards the centre of mass of neighbouring boids.
function enforceRuleOne(boid) {
  // "perceived center"
  pc = calcRelCenterMass(boid)
  for (let b of boidList) {
    if (b !== boid) {
      pc[0] = pc[0] + b.position[0]
      pc[1] = pc[1] + b.position[1]
    }
  }
  pc[0] = pc[0] / (boidList.length - 1)
  pc[1] = pc[1] / (boidList.length - 1)

  // divide difference by 100 to move .001% of the way
  dx = (pc[0] - boid.position[0]) / 10000
  dy = (pc[1] - boid.position[1]) / 10000
  return [dx, dy]
}



// Rule 2: Rule 2: Boids try to keep a small distance away from other objects (including other boids)
function enforceRuleTwo(boid, minDist) {
  c = [0,0]
  for(let b of boidList) {
    if (b !== boid) {
      if (calcEuclid(b.position, boid.position) < minDist ) {
        c[0] = c[0] - (b.position[0] - boid.position[0])
        c[1] = c[1] - (b.position[1] - boid.position[1])
      }
    }
  }
  return c
}



/* calculates average x and y of all boids (except the passed one, to achieve
 more realistic behavior).
 Returns an array of x and y coordinate
*/
function calcRelCenterMass(boid) {
  let avg_x = 0
  let avg_y = 0
  for (let b of boidList) {
    if (b === boid) {continue} 
    avg_x += b.position[0]
    avg_y += b.position[1]
  }
  avg_x /= (boidList.length - 1)
  avg_y /= (boidList.length - 1)

  return [avg_x, avg_y]
}


// calc euclidean distance
function calcEuclid(pos1, pos2) {
  x1 = pos1[0]
  x2 = pos1[1]
  y1 = pos2[0]
  y2 = pos2[1]

  return Math.sqrt(Math.pow((x1-y1), 2) + Math.pow((x2-y2), 2))
}






// ----------------------- Classes ----------------------

// triangle class
class Triangle {
  constructor(id, x, y, width, height, color, dx, dy) {
    this.id = id;
    // the deltas are the directional vectors aka the velocity
    this.position = [x, y]
    this.velocity = [dx, dy]
    this.width = width
    this.height = height
    this.color = color

  }

}





























class Circle {
  constructor(x, y, radius, color, dx, dy) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.width = width
    this.height = height
    this.color = color

    this.drawCircle = function () {
      if ((x + dx + radius/2 ) <= 0) {
        dx = -dx
      }
      if ((x + dx + radius/2) >= cvs.width) {
        dx = -dx
      }
      if ((y + dy + radius/2) <= 0) {
        dy = -dy
      }
      if ((y + dy + radius/2) >= cvs.height) {
        dy = -dy
      }
      x += dx
      y += dy

      context.beginPath()
      context.arc(x, y, radius, 2 * Math.PI, false)
      context.fillStyle = color
      context.fill()
    }
  }
}
