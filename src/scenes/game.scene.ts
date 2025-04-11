import {webSocket, MessageType} from "../net/game-web-socket";
import PhaserLogo from "../actors/phaserLogo";
import {Direction} from "../shared/direction";
import Graphics = Phaser.GameObjects.Graphics;
import {Raycaster} from "../shared/raycaster";
import {angleRadBetween, toDegrees, toRadians} from "../shared/math-utils";
import Vector2 = Phaser.Math.Vector2;
import { useGlobalState } from '../hooks';

export default class GameScene extends Phaser.Scene {
    private player: PhaserLogo
    private featureGraphics: Phaser.GameObjects.Graphics
    private mapGraphics: Phaser.GameObjects.Graphics
    private raycaster: Raycaster
    private obstacles: Array<Phaser.Geom.Polygon>
    private keymap: any = {
        'd': Direction.RIGHT,
        's': Direction.DOWN,
        'a': Direction.LEFT,
        'w':Direction.UP,
        'в': Direction.RIGHT,
        'ы': Direction.DOWN,
        'ф': Direction.LEFT,
        'ц': Direction.UP
    };


    constructor() {
        super('game')
        // Use this update handler to update game state coming from websocket
        webSocket.on(MessageType.UPDATE, (data) => {

        }, this)
    }

    create() {
        useGlobalState(state => state.setVersion(`Phaser v${Phaser.VERSION}`));

        this.mapGraphics = this.add.graphics({
            lineStyle: {width: 2, color: 0x00aaff, alpha: 1.0},
            fillStyle: {color: 0x00aaff, alpha: 1.0}
        });
        this.featureGraphics = this.add.graphics({
            lineStyle: {width: 2, color: 0xff0000, alpha: 1.0},
            fillStyle: {color: 0xff0000, alpha: 1.0}
        });
        this.player = new PhaserLogo(this, this.cameras.main.width / 2, 0)
        this.cameras.main.startFollow(this.player)

        this.obstacles = [
            new Phaser.Geom.Polygon([
                550, 0,
                700, 0,
                700, 200,
                550, 200,
                550, 0
            ]),
            new Phaser.Geom.Polygon([
                800, 100,
                900, 60,
                1000, 200,
                900, 240,
                800, 100,
            ])
        ]

        this.initMap()
        this.raycaster = new Raycaster({
            debug: false,
            raysNum: 60,
            sectorAngle: toRadians(60),
            distance: 700
        }, this, this.player.x, this.player.y, this.obstacles);

        this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (evt: { key: string; }) => {
            const direction = this.keymap[evt.key]
            if (direction)
                this.player.setDirection(direction, true)
        });
        this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, (evt: { key: string; }) => {
            const direction = this.keymap[evt.key]
            if (direction)
                this.player.setDirection(direction, false)
        });

        // display the Phaser.VERSION
        this.add
            .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
                color: '#000000',
                fontSize: '24px'
            })
            .setOrigin(1, 0)
    }

    initMap() {
        this.obstacles.forEach(polygon => {
            this.drawPoly(this.mapGraphics, polygon.points, true);
        });
    }

    drawPoly(graphics: Graphics, poly, fill = false) {
        if (poly.length === 0)
            return
        graphics.beginPath();
        graphics.moveTo(poly[0].x, poly[0].y);
        for (let i = 1; i < poly.length; i++) {
            graphics.lineTo(poly[i].x, poly[i].y);
        }
        graphics.closePath();
        if (!fill)
            graphics.strokePath();
        else
            graphics.fillPath()
    }

    update(time, delta) {
        this.player.update(time, delta)
        const evtPoint: Vector2 = this.cameras.main.getWorldPoint(this.scene.scene.input.activePointer.x, this.scene.scene.input.activePointer.y);
        const angleRad = angleRadBetween(this.player.x, this.player.y, evtPoint.x, evtPoint.y)
        this.player.setAngle(toDegrees(angleRad + Phaser.Math.PI2 / 4))
        this.featureGraphics.clear()
        this.raycaster.setTo(this.player.x, this.player.y, angleRad)
        this.drawPoly(this.featureGraphics, this.raycaster.castCone(), true)
        useGlobalState(state => state.setFps(Math.trunc(this.sys.game.loop.actualFps)));
    }
}
