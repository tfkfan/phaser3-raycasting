import Vector2 = Phaser.Math.Vector2;
import Vector4 = Phaser.Math.Vector4;

export class Raycaster {
    private config: any;
    private scene: Phaser.Scene
    private position: Vector2
    private angle: number
    private ray: Phaser.Geom.Line
    private objects: any

    private graphics:Phaser.GameObjects.Graphics

    constructor(config: any, scene: Phaser.Scene, x: number, y: number, objects) {
        this.scene = scene;
        this.graphics = scene.add.graphics( {lineStyle: {width: 2, color: 0xff0000, alpha: 1.0}})
        this.config = {
            debug: config.debug ?? false,
            raysNum: config.raysNum ?? 30,
            sectorAngle: config.sectorAngle ?? Math.PI / 4,
            distance: config.distance ?? 300
        }
        this.position = new Vector2(x, y)
        this.angle = 0;
        this.ray = new Phaser.Geom.Line(this.position.x, this.position.y, this.position.x + 1, this.position.y + 1);
        this.objects = objects;
    }

    setTo(x, y, angle) {
        this.position.x = x;
        this.position.y = y;
        this.angle = angle;
    }
    castCone(): Array<Phaser.Math.Vector4> {
        this.graphics.clear()
        const view = [new Vector4(this.position.x, this.position.y)];
        const delta = this.config.sectorAngle / this.config.raysNum
        for (let i = this.angle - this.config.sectorAngle / 2; i < this.angle + this.config.sectorAngle / 2; i += delta) // default number of rays set to 30
            view.push(this.castRay(i))
        return view
    }

    private castRay(angle: number): Phaser.Math.Vector4 {
        Phaser.Geom.Line.SetToAngle(this.ray, this.position.x, this.position.y, angle, this.config.distance);
        const cp = Phaser.Geom.Intersects.GetLineToPolygon(this.ray, this.objects);
        if (this.config.debug) {
            if (cp != null)
                this.graphics.lineBetween(this.ray.x1, this.ray.y1, cp.x, cp.y);
            else
                this.graphics.lineBetween(this.ray.x1, this.ray.y1, this.ray.x2, this.ray.y2);
        }
        return cp != null ? cp : new Vector4(this.ray.x2, this.ray.y2, 0, 0);
    }

}