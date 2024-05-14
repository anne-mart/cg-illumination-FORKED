import { Scene } from '@babylonjs/core/scene';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { RawTexture } from '@babylonjs/core/Materials/Textures/rawTexture';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CreateCylinder, VertexData } from '@babylonjs/core';

const BASE_URL = import.meta.env.BASE_URL || '/';

class Renderer {
    constructor(canvas, engine, material_callback, ground_mesh_callback) {
        this.canvas = canvas;
        this.engine = engine;
        this.scenes = [
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.1, 0.1, 0.1, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            },
            { //scene 2
                scene: new Scene(this.engine),
                background_color: new Color4(0.0, 1.0, 1.0, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            },
            { //scene 3
                scene: new Scene(this.engine),
                background_color: new Color4(0.75, 0.15, 0.05, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.4, 0.4, 0.4),
                lights: [],
                models: []
            },
            { //scene 4
                scene: new Scene(this.engine),
                background_color: new Color4(0.55, 0.55, 0.55, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.4, 0.4, 0.4),
                lights: [],
                models: []
            }
        ];
        this.active_scene = 0;
        this.active_light = 0;
        this.shading_alg = 'gouraud';
        //using the keys to change the position of the lighting
        window.addEventListener("keypress", a => {
            //a : translate -x
            if (String.fromCharCode(a.keyCode) === 'a') {
                this.scenes[this.active_scene].lights[this.active_light].position.x -= 1;
            //d : translate +x
            } else if (String.fromCharCode(a.keyCode) === 'd') {
                this.scenes[this.active_scene].lights[this.active_light].position.x += 1;
            //f : translate -y
            } else if (String.fromCharCode(a.keyCode) === 'f') {
                this.scenes[this.active_scene].lights[this.active_light].position.y -= 1;
            //r : translate +y
            } else if (String.fromCharCode(a.keyCode) === 'r') {
                this.scenes[this.active_scene].lights[this.active_light].position.y += 1;
            //w: translate -z
            } else if (String.fromCharCode(a.keyCode) === 'w') {
                this.scenes[this.active_scene].lights[this.active_light].position.z -= 1;
            //s: translate +z
            } else if (String.fromCharCode(a.keyCode) === 's') {
                this.scenes[this.active_scene].lights[this.active_light].position.z += 1;
            }
            console.log(this.scenes[this.active_scene].lights[this.active_light].position);
        });
        this.scenes.forEach((scene, idx) => {
            scene.materials = material_callback(scene.scene);
            scene.ground_mesh = ground_mesh_callback(scene.scene, scene.ground_subdivisions);
            this['createScene'+ idx](idx);
        });
    }

    createScene0(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources LIGHT POINT SRC 0
        let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        // Create point light sources LIGHT POINT SRC 1
        let light1 = new PointLight('light1', new Vector3(0.0, 3.0, 0.0), scene);
        light1.diffuse = new Color3(0.1, 0.1, 0.1);
        light1.specular = new Color3(0.1, 0.1, 0.1);
        current_scene.lights.push(light1);
       
        // Create point light sources LIGHT POINT SRC 2
        let light2 = new PointLight('light1', new Vector3(0.0, 3.0, 0.0), scene);
        light2.diffuse = new Color3(0.5, 0.5, 0.5);
        light2.specular = new Color3(0.5, 0.5, 0.5);
        current_scene.lights.push(light2);
    
       // Create ground mesh
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(20.0, 1.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(0.10, 0.65, 0.15),
            mat_texture: white_texture,
            mat_specular: new Color3(0.0, 0.0, 0.0),
            mat_shininess: 15,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];
        
        // Create other models
        let sphere = CreateSphere('sphere', {segments: 32}, scene);
        sphere.position = new Vector3(1.0, 0.5, 3.0);
        sphere.metadata = {
            mat_color: new Color3(0.10, 0.35, 0.88),
            mat_texture: white_texture,
            mat_specular: new Color3(0.8, 0.8, 0.8),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere);

        let box = CreateBox('box', {width: 2, height: 1, depth: 1}, scene);
        box.position = new Vector3(-1.0, 0.5, 2.0);
        box.metadata = {
            mat_color: new Color3(0.75, 0.15, 0.05),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        }
        box.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(box);


        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }

    createScene1(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        let light1 = new PointLight('light1', new Vector3(0.0, 3.0, 0.0), scene);
        light1.diffuse = new Color3(1.0, 1.0, 1.0);
        light1.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light1);

        // Create ground mesh
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(20.0, 1.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(0.10, 0.65, 0.15),
            mat_texture: white_texture,
            mat_specular: new Color3(0.0, 0.0, 0.0),
            mat_shininess: 1,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];
        
        // Create other models
        let sphere = CreateSphere('sphere', {segments: 32}, scene);
        sphere.position = new Vector3(2.0, 0.3, 2.0);
        sphere.metadata = {
            mat_color: new Color3(0.97, 0.97, 0.97),
            mat_texture: white_texture,
            mat_specular: new Color3(0.8, 0.8, 0.8),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere);

        let box = CreateBox('box', {width: 2, height: 1, depth: 1}, scene);
        box.position = new Vector3(-1.0, 0.5, 2.0);
        box.metadata = {
            mat_color: new Color3(0.75, 0.15, 0.05),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        }
        box.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(box);


        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }
    createScene2(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(48.0, 10.0, 1.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 5.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        light0.diffuse = new Color3(1.0, 0.3, 0.9);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        let light1 = new PointLight('light1', new Vector3(30.0, 3.0, 0.0), scene);
        light1.diffuse = new Color3(1.0, 0.3, 0.9);
        light1.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light1);

        // Create ground mesh
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let wood_texture = new Texture(BASE_URL + 'wood.jpg', scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(100.0, 1.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(0.83, 0.61, 0.40),
            mat_texture: wood_texture,
            mat_specular: new Color3(0.0, 0.0, 0.0),
            mat_shininess: 7,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 0.1,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];
        
        // Create other models
        let ball = CreateSphere('sphere', {diameter: 4}, scene);
        let bowlingBallTexture = new Texture(BASE_URL + 'bowlingBall.png', scene);
        ball.position = new Vector3(25.0, 2.0, 0.0);
        ball.metadata = {
            mat_color: new Color3(1.0, 1.0, 1.0),
            mat_texture: bowlingBallTexture,
            mat_specular: new Color3(0.8, 0.8, 0.8),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0)
        }
        ball.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(ball);

        //creating the base for a bowling pin
        let pinbase = CreateCylinder('pinbase', {diameter: 1, height: 5, diameterTop: 3}, scene);
        pinbase.position = new Vector3(-20.0, 0.5, 2.0);
        pinbase.metadata = {
            mat_color: new Color3(0.95, 0.95, 0.95),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        };
        pinbase.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(pinbase);

        let pinmiddle = CreateCylinder('pinmiddle', {diameter: 3, height: 5, diameterTop: 1.0}, scene);
        pinmiddle.position = new Vector3(-20.0, 5.5, 2.0);
        pinmiddle.metadata = {
            mat_color: new Color3(0.95, 0.95, 0.95),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        };
        pinmiddle.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(pinmiddle);

        let pinribbon = CreateCylinder('pinribbon', {diameter: 1.0, height: .5}, scene);
        pinribbon.position = new Vector3(-20.0, 8.0, 2.0);
        pinribbon.metadata = {
            mat_color: new Color3(0.9, 0.1, 0.1),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        };
        pinribbon.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(pinribbon);

        let pintop = CreateCylinder('pintop', {radius:0.23, height:1.5, radiusTop:1}, scene);
        pintop.position = new Vector3(-20.0, 9.0, 2.0);
        pintop.metadata = {
            mat_color: new Color3(0.95, 0.95, 0.95),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        };
        pintop.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(pintop);

        //creating the base for a bowling pin
        let pinbase1 = CreateCylinder('pinbase1', {diameter: 1, height: 5, diameterTop: 3}, scene);
        pinbase1.position = new Vector3(-25.0, 0.5, 5.0);
        pinbase1.metadata = {
            mat_color: new Color3(0.95, 0.95, 0.95),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        };
        pinbase1.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(pinbase1);

        let pinmiddle1 = CreateCylinder('pinmiddle1', {diameter: 3, height: 5, diameterTop: 1.0}, scene);
        pinmiddle1.position = new Vector3(-25.0, 5.5, 5.0);
        pinmiddle1.metadata = {
            mat_color: new Color3(0.95, 0.95, 0.95),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        };
        pinmiddle1.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(pinmiddle1);

        let pinribbon1 = CreateCylinder('pinribbon1', {diameter: 1.0, height: .5}, scene);
        pinribbon1.position = new Vector3(-25.0, 8.0, 5.0);
        pinribbon1.metadata = {
            mat_color: new Color3(0.9, 0.1, 0.1),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        };
        pinribbon1.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(pinribbon1);

        let pintop1 = CreateCylinder('pintop', {radius:0.23, height:1.5, radiusTop:1}, scene);
        pintop1.position = new Vector3(-25.0, 9.0, 5.0);
        pintop1.metadata = {
            mat_color: new Color3(0.95, 0.95, 0.95),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        };
        pintop1.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(pintop1);


        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }

    createScene3(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        let light1 = new PointLight('light1', new Vector3(0.0, 3.0, 0.0), scene);
        light1.diffuse = new Color3(1.0, 1.0, 1.0);
        light1.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light1);
        


        // Create ground mesh
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(20.0, 1.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(0.10, 0.65, 0.15),
            mat_texture: white_texture,
            mat_specular: new Color3(0.0, 0.0, 0.0),
            mat_shininess: 1,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];
        
                //create custom model 
                let treeVertexData = new VertexData();
                let treepositions = 
                    [3.0, 1.0, 3.0, //0
                     3.0, 1.0, -3.0, //1
                    -3.0, 1.0, -3.0, //2
                    -3.0, 1.0, 3.0, //3
                     0.0, 3.0, 0.0, //4
                     
                     2.0, 2.0, 2.0, //5
                     2.0, 2.0, -2.0, //6
                    -2.0, 2.0, -2.0, //7
                    -2.0, 2.0, 2.0, //8
                     0.0, 5.0, 0.0, //9
                    
                     1.0, 4.0, 1.0, //10
                     1.0, 4.0, -1.0, //11
                    -1.0, 4.0, -1.0, //12
                    -1.0, 4.0, 1.0, //13
                     0.0, 8.0, 0.0, //14
                    
                     0.5, 6.5, 0.5, //15
                     0.5, 6.5, -0.5, //16
                    -0.5, 6.5, -0.5, //17
                    -0.5, 6.5, 0.5, //18
                     0.0, 11, 0.0]; //19
        
                let treeIndices = [
                    0, 1, 2, //bottom of 1st pyramid
                    0, 3, 2,
                    0, 1, 4, //starting the 4 angled faces
                    1, 2, 4,
                    2, 3, 4,
                    3, 0, 4,
        
                    5, 6, 7, //bottom of 2nd pyramid
                    5, 8, 7,
                    5, 6, 9, //starting the 4 angled faces
                    6, 7, 9,
                    7, 8, 9,
                    8, 5, 9,
        
                    10, 11, 12, //bottom of 3rd pyramid
                    10, 13, 12,
                    10, 11, 14, //starting the 4 angled faces
                    11, 12, 14,
                    12, 13, 14,
                    13, 10, 14,
        
                    15, 16, 17, //bottom of 3rd pyramid
                    15, 18, 17,
                    15, 16, 19, //starting the 4 angled faces
                    16, 17, 19,
                    17, 18, 19,
                    18, 15, 19
                ];
        
                treeVertexData.positions = treepositions;
                treeVertexData.indices = treeIndices;
        
                // let treeMesh = new Mesh("treeMesh", current_scene);
                // treeMesh.setData(treeVertexData);
                // scene.addMesh(treeMesh);
                


        // Create other models
        let sphere = CreateSphere('sphere', {segments: 32}, scene);
        sphere.position = new Vector3(2.0, 0.3, 2.0);
        sphere.metadata = {
            mat_color: new Color3(0.97, 0.97, 0.97),
            mat_texture: white_texture,
            mat_specular: new Color3(0.8, 0.8, 0.8),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere);

        let box = CreateBox('box', {width: 2, height: 1, depth: 1}, scene);
        box.position = new Vector3(-1.0, 0.5, 2.0);
        box.metadata = {
            mat_color: new Color3(0.75, 0.15, 0.05),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        }
        box.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(box);


        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }

    updateShaderUniforms(scene_idx, shader) {
        let current_scene = this.scenes[scene_idx];
        shader.setVector3('camera_position', current_scene.camera.position);
        shader.setColor3('ambient', current_scene.scene.ambientColor);
        shader.setInt('num_lights', current_scene.lights.length);
        let light_positions = [];
        let light_colors = [];
        current_scene.lights.forEach((light) => {
            light_positions.push(light.position.x, light.position.y, light.position.z);
            light_colors.push(light.diffuse);
        });
        shader.setArray3('light_positions', light_positions);
        shader.setColor3Array('light_colors', light_colors);
    }

    getActiveScene() {
        return this.scenes[this.active_scene].scene;
    }
    
    setActiveScene(idx) {
        this.active_scene = idx;
    }

    setShadingAlgorithm(algorithm) {
        this.shading_alg = algorithm;

        this.scenes.forEach((scene) => {
            let materials = scene.materials;
            let ground_mesh = scene.ground_mesh;

            ground_mesh.material = materials['ground_' + this.shading_alg];
            scene.models.forEach((model) => {
                model.material = materials['illum_' + this.shading_alg];
            });
        });
    }

    setHeightScale(scale) {
        this.scenes.forEach((scene) => {
            let ground_mesh = scene.ground_mesh;
            ground_mesh.metadata.height_scalar = scale;
        });
    }

    setActiveLight(idx) {
        console.log(idx);
        this.active_light = idx;
    }
}

export { Renderer }