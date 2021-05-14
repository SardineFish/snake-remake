import { Animator, BoxCollider, SpriteObject, Time, Timeline, vec2 } from "zogra-engine";
import { GameAssets } from "./assets";
import { foodCountdownTimeline, foodLeaveTimeline, foodSpawnTimeline, IFood } from "./food";
import { Block } from "./score";

export class BoostFood extends SpriteObject implements IFood
{
    static size = 0.6;
    static animBeat = Timeline({
        duration: 0.375,
        loop: true,
        frames: {
            [0]: {
                size: 1
            },
            [0.05]: {
                size: 0.7,
            },
            [0.375]: {
                size: 1,
            }
        },
        updater: (frame, target: BoostFood) =>
        {
            target.size = vec2(BoostFood.size * frame.size);
        }
    });


    stateBlock: Block = null as any;
    score = 0;
    
    animator: Animator<unknown, BoostFood> = new Animator(this);

    constructor()
    {
        super();
        this.sprite = GameAssets.boostSprite;
        const collider = new BoxCollider();
        collider.size = vec2(BoostFood.size);
        this.collider = collider;
    }

    async start()
    {
        this.animator.play(BoostFood.animBeat, this, Number.POSITIVE_INFINITY);
        await this.animator.play(foodSpawnTimeline, this, 5);
        await this.animator.play(foodCountdownTimeline, this, 5);
        await this.animator.play(foodLeaveTimeline, this);
        this.destroy();
    }

    update(time: Time)
    {
        this.animator.update(time.deltaTime);
    }
}