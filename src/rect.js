export class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    translate(vec) {
        return new Rectangle(this.x + vec.x, this.y + vec.y, this.w, this.h);
    }

    scale(vec) {
        return new Rectangle(this.x, this.y, this.w * vec.x, this.h * vec.y);
    }

    rotate(angle) {
        return new Rectangle(
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.x * Math.sin(angle) + this.y * Math.cos(angle),
            this.w,
            this.h
        );
    }

    update(updated_fields) {
        return new Rectangle({...this, ...updated_fields});
    }
}
