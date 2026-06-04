export class Vector2 {
    constructor(public x: number, public y: number) { }

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    sub(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    mult(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    div(scalar: number): Vector2 {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    cross(other: Vector2): number {
        return this.x * other.y - this.y * other.x;
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2 {
        const len = this.magnitude();
        if (len === 0) return new Vector2(0, 0);
        return this.div(len);
    }

    distanceTo(other: Vector2): number {
        return this.sub(other).magnitude();
    }

    copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    angleTo(other: Vector2): number {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }

    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    rotate(angle: number): Vector2 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    lerp(other: Vector2, t: number): Vector2 {
        return new Vector2(
            this.x + (other.x - this.x) * t,
            this.y + (other.y - this.y) * t
        );
    }

    static zero(): Vector2 {
        return new Vector2(0, 0);
    }

}