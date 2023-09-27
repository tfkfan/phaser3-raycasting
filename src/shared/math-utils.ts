export const angleBetween = (vx,vy, ux,uy)=>
    Phaser.Math.RAD_TO_DEG * (Phaser.Math.Angle.Between(vx,vy, ux, uy) )
export const angleRadBetween = (vx,vy, ux,uy)=>
    (Phaser.Math.Angle.Between(vx,vy, ux, uy) )

export const toDegrees = (radians)=>Phaser.Math.RAD_TO_DEG * radians

export const toRadians = (degrees)=>Phaser.Math.DEG_TO_RAD * degrees