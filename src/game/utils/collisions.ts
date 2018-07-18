export const collidePolyPoly = (p1: p5.Vector[], p2: p5.Vector[], interior: boolean = false): boolean => {
    if (interior == undefined) {
        interior = false;
    }

    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for (var current = 0; current < p1.length; current++) {

        // get next vertex in list, if we've hit the end, wrap around to 0
        next = current + 1;
        if (next == p1.length) next = 0;

        // get the PVectors at our current position this makes our if statement a little cleaner
        var vc = p1[current];    // c for "current"
        var vn = p1[next];       // n for "next"

        //use these two points (a line) to compare to the other polygon's vertices using polyLine()
        var collision = collideLinePoly(vc.x, vc.y, vn.x, vn.y, p2);
        if (collision) return true;

        //check if the 2nd polygon is INSIDE the first
        if (interior == true) {
            collision = collidePointPoly(p2[0].x, p2[0].y, p1);
            if (collision) return true;
        }
    }

    return false;
}



const collideLinePoly = (x1: number, y1: number, x2: number, y2: number, vertices: p5.Vector[]) => {

    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for (var current = 0; current < vertices.length; current++) {

        // get next vertex in list if we've hit the end, wrap around to 0
        next = current + 1;
        if (next == vertices.length) next = 0;

        // get the PVectors at our current position extract X/Y coordinates from each
        var x3 = vertices[current].x;
        var y3 = vertices[current].y;
        var x4 = vertices[next].x;
        var y4 = vertices[next].y;

        // do a Line/Line comparison if true, return 'true' immediately and stop testing (faster)
        var hit = collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4);
        if (hit) {
            return true;
        }
    }
    // never got a hit
    return false;
}

const collideLineLine = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) => {
    // calculate the distance to intersection point
    var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true;
    }
    return false;
}

const collidePointPoly = (px: number, py: number, vertices: p5.Vector[]) => {
    var collision = false;

    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for (var current = 0; current < vertices.length; current++) {

        // get next vertex in list if we've hit the end, wrap around to 0
        next = current + 1;
        if (next == vertices.length) next = 0;

        // get the PVectors at our current position this makes our if statement a little cleaner
        var vc = vertices[current];    // c for "current"
        var vn = vertices[next];       // n for "next"

        // compare position, flip 'collision' variable back and forth
        if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
            (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
            collision = !collision;
        }
    }
    return collision;
}