#version 300 es
precision mediump float;

// Input
in vec2 model_uv;
in vec3 diffuse_illum;
in vec3 specular_illum;

// Uniforms
// material
uniform vec3 mat_color;
uniform vec3 mat_specular;
uniform sampler2D mat_texture;
uniform vec3 ambient; // Ia

// Output
out vec4 FragColor;

void main() {
    vec3 model_color = mat_color * texture(mat_texture, model_uv).rgb;
    vec3 ambient_illum = ambient * model_color;
        vec4 diffuse_illum2 = vec4(diffuse_illum * model_color, 1.0);
    vec4 specular_illum2 = vec4(specular_illum * mat_specular, 1.0);
    vec4 ambient_illum2 = vec4(ambient_illum, 1.0);
 

    // Color
    FragColor = min(vec4(1.0, 1.0, 1.0, 1.0), diffuse_illum2 + specular_illum2 + ambient_illum2);
}