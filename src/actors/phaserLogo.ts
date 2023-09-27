import {Direction} from "../shared/direction";
import Phaser from "phaser";
import {GameConfig} from "../config/constants";
import Vector2 = Phaser.Math.Vector2;

export default class PhaserLogo extends Phaser.Physics.Arcade.Sprite {
    public directionState: Map<Direction, boolean> = new Map();
    public isMoving: boolean
    public target: Vector2

    constructor(scene, x, y) {
        super(scene, x, y, 'phaser-logo')
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.isMoving = false
        this.target = new Vector2(0, 0)
        this.directionState.set(Direction.RIGHT, false)
        this.directionState.set(Direction.UP, false)
        this.directionState.set(Direction.DOWN, false)
        this.directionState.set(Direction.LEFT, false)
    }

    update(time, delta): void {
        super.update(time, delta);

        const activeState = [];
        this.directionState.forEach((value, key) => {
            if (value)
                activeState.push(key)
        })
        this.isMoving = activeState.length > 0

        if (this.isMoving) {
            const vec = [0, 0]
            if (this.directionState.get(Direction.UP))
                vec[1] = -GameConfig.playerAbsVelocity;
            else if (this.directionState.get(Direction.DOWN))
                vec[1] = GameConfig.playerAbsVelocity;

            if (this.directionState.get(Direction.RIGHT))
                vec[0] = GameConfig.playerAbsVelocity;
            else if (this.directionState.get(Direction.LEFT))
                vec[0] = -GameConfig.playerAbsVelocity;
            this.setPosition(this.x + vec[0], this.y + vec[1])
        }
    }

    setDirection(direction: Direction, state: boolean) {
        this.directionState.set(direction, state)
    }
}
