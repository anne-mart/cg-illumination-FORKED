#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec2 uv;

// Uniforms
// projection 3D to 2D
uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;
// height displacement
uniform vec2 ground_size;
uniform float height_scalar;
uniform sampler2D heightmap;
// material
uniform float mat_shininess;
uniform vec2 texture_scale;
// camera
uniform vec3 camera_position;
// lights
uniform int num_lights;
uniform vec3 light_positions[8];
uniform vec3 light_colors[8];

// Output
out vec2 model_uv;
out vec3 diffuse_illum;
out vec3 specular_illum;

void main() {
    // Get initial position of vertex (prior to height displacement)
    vec4 world_pos = world * vec4(position, 1.0);

    vec3 frag_pos = world_pos.xyz; //vertex->frag shader
    vec3 frag_norm = vec3(0.0, 1.0, 0.0); //vertex->frag shader
    model_uv = uv; //vertex->frag shader


    // Pass diffuse and specular illumination onto the fragment shader
    vec3 updatedpos = (world*vec4(position, 1.0)).xyz;
    vec3 N = normalize(frag_norm);


    //height displacement
    float x = texture(heightmap, model_uv).r;
    frag_pos.y += 1.0 * height_scalar * (x);

    float n = 0.03;
    vec2 p1_uv = vec2(model_uv.x + n, model_uv.y);
    vec3 p1_pos = vec3(frag_pos.x+2.0 + ground_size.x * n+2.0, frag_pos.y, frag_pos.z);
    vec2 p2_uv = vec2(model_uv.x, model_uv.y + n);
    vec3 p2_pos = vec3(frag_pos.x, frag_pos.y + ground_size.y * n+3.0, frag_pos.z);

    vec3 tangent = p1_pos - frag_pos;
    vec3 bitangent = p2_pos - frag_pos;
    frag_norm = normalize(cross(tangent, bitangent));


    for (int i = 0; i < num_lights; i++) {
        vec3 L = normalize(light_positions[i] - updatedpos);
        vec3 R = normalize(2.0 * dot(N,L) * N-L);
        vec3 V = normalize(camera_position - updatedpos);
        diffuse_illum += vec3(light_colors[i] * max(dot(N, L), 0.0));
        specular_illum += vec3(light_colors[i]  * pow(max(dot(R, V), 0.0), mat_shininess));
    }

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * vec4(frag_pos, 1.0);
}
