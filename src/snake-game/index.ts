import noisejs from "noisejs";
import * as ZograEnginePackage from "zogra-engine";
import { Animator, Bloom, Default2DRenderPipeline, EventEmitter, EventKeys, InputManager, Keys, MathUtils, MSAASamples, Physics2D, Projection, Scene, TextureFormat, vec2, vec3, ZograEngine, ZograRenderer } from "zogra-engine";
import { loadAssets } from "./assets";
import { GameCamera } from "./game-camera";
import { GameMap } from "./map";
import { GameScore } from "./score";
import { GameSettings } from "./settings";
import { Snake } from "./snake";

(window as any).Noise = noisejs.Noise;
(window as any).ZograEngine = ZograEnginePackage;

interface GameEvents
{
    gameover(score: GameScore): void,
    start(): void,
}

export class SnakeGame
{
    static instance: SnakeGame;
    canvas: HTMLCanvasElement;
    engine: ZograEngine<Default2DRenderPipeline>;
    input: InputManager;
    
    /** @internal */
    eventEmitter = new EventEmitter<GameEvents>();
    animator = new Animator();
    settings: GameSettings = {
        hdr: "16bit",
        msaaSamples: 2,
        postprocess: true,
        resolutionScale: 1
    }
    snake?: Snake;
    
    constructor(canvas: HTMLCanvasElement)
    {
        SnakeGame.instance = this;

        this.canvas = canvas;
        this.engine = new ZograEngine(canvas, Default2DRenderPipeline);
        this.engine.renderPipeline.ambientIntensity = 0.2;
        this.engine.renderPipeline.msaa = 4;
        this.engine.renderPipeline.renderFormat = TextureFormat.RGBA16F;

        this.input = new InputManager();
        this.engine.start();
        this.engine.on("update", (time) =>
        {
            this.input.update();

            if (this.input.getKeyDown(Keys.F2))
            {
                this.reload();
            }
            this.animator.update(time.deltaTime);
        });

        window.onresize = () =>
        {
            const rect = canvas.getBoundingClientRect();
            this.engine.renderer.setSize(rect.width * this.settings.resolutionScale, rect.height * this.settings.resolutionScale);
        };
    }
    updateSettings(settings: GameSettings)
    {
        this.settings = settings;
        this.engine.renderPipeline.msaa = settings.msaaSamples as MSAASamples;
        const rect = this.canvas.getBoundingClientRect();
        switch (settings.hdr)
        {
            case "disable":
                this.engine.renderPipeline.renderFormat = TextureFormat.RGBA8;
                break;
            case "16bit":
                this.engine.renderPipeline.renderFormat = TextureFormat.RGBA16F;
                break;
            case "32bit":
                this.engine.renderPipeline.renderFormat = TextureFormat.RGBA32F;
                break;
        }
        this.engine.renderer.setSize(rect.width * settings.resolutionScale + 1, rect.height * settings.resolutionScale);
        this.engine.renderer.setSize(rect.width * settings.resolutionScale - 1, rect.height * settings.resolutionScale);
    }
    async loadAssets()
    {
        await GameMap.loadMapAssets();
        await loadAssets();
    }
    async reload()
    {
        await this.animator.playProceduralOn(0, 0.5, (t, dt) =>
        {
            if (this.snake)
            {
                this.snake.light.intensity = MathUtils.lerp(this.snake.light.intensity, 0, t);
                this.snake.ambientIntensity = MathUtils.lerp(this.snake.ambientIntensity, 0, t);
            }
        })
        this.engine.scene.destroy();
        const scene = new Scene(Physics2D);
        this.engine.scene = scene;

        const camera = new GameCamera();
        camera.position = vec3(0, 0, 20);
        camera.projection = Projection.Orthographic;
        camera.viewHeight = 10;
        if (this.canvas.height > this.canvas.width)
        {
            camera.viewHeight = 10 * 1.2;
        }
        scene.add(camera);

        if (this.settings.postprocess)
        {
            const bloom = new Bloom();
            bloom.threshold = 1.0;
            bloom.softThreshold = 0.5;
            camera.postprocess.push(bloom);
        }

        const tilemap = new GameMap(Math.random());
        scene.add(tilemap);

        let snake: Snake;
        while (true)
        {
            let pos = vec2.math(Math.floor)(vec2.math(Math.random)().mul(1000)).plus(0.5);
            let bodies: vec2[] = [];
            for (let i = 0; i < 10; i++)
            {
                if (tilemap.getTile(pos.plus(vec2.right())) === GameMap.tileGround)
                {
                    if (i < 4)
                        bodies.push(pos.clone());
                }
                else
                    bodies = [];
            }
            if (bodies.length == 4)
            {
                snake = new Snake(bodies, vec2.right(), camera, this.input);
                camera.position = camera.position.set(pos.toVec3(camera.position.z));
                break;
            }
        }
        this.snake = snake;
        scene.add(snake);

        this.eventEmitter.emit("start");

        camera.followTarget = snake.headEntity;
        camera.position = snake.headEntity.position.clone().setZ(20);
    }

    on<T extends EventKeys<GameEvents>>(event: T, listener: GameEvents[T])
    {
        this.eventEmitter.on(event, listener);
    }
    off<T extends EventKeys<GameEvents>>(event: T, listener: GameEvents[T])
    {
        this.eventEmitter.off(event, listener);
    }
}