export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    sub(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    mul(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    div(scalar) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    cross(other) {
        return this.x * other.y - this.y * other.x;
    }

    magnitude() {
        return Math.sqrt(this.dot(this));
    }

    normalize() {
        return this.div(this.magnitude());
    }

    rotate(angle) {
        return new Vector2(
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.x * Math.sin(angle) + this.y * Math.cos(angle)
        );
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    static from_angle(angle) {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }
}
