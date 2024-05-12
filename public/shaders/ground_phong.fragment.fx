#version 300 es
precision mediump float;

// Input
in vec3 model_position;
in vec3 model_normal;
in vec2 model_uv;

// Uniforms
// material
uniform vec3 mat_color;
uniform vec3 mat_specular;
uniform float mat_shininess;
uniform sampler2D mat_texture;
// camera
uniform vec3 camera_position;
// lights
uniform vec3 ambient; // Ia
uniform int num_lights;
uniform vec3 light_positions[8];
uniform vec3 light_colors[8]; // Ip

// Output
out vec4 FragColor;

void main() {

    //need to define world_position, which will tell where the fragment is on the model's surface
    vec3 world_position = model_position;
     //start with ambient contribution
    vec3 ambient_contrib = mat_color * ambient;

    // Diffuse contribution (initialize to black, then loop through lights)
    vec3 diffuse_contrib = vec3(0.0);
    //specular contribution
    vec3 specular_contrib = vec3(0.0);
    vec3 normalizedRefLightDirection = vec3(0.0);
    vec3 viewDirection = vec3(0.0);

    for (int i = 0; i < num_lights; ++i) {
        // Light direction
        vec3 light_dir = normalize(light_positions[i] - world_position);

        //using max() to enzure the factor isn't negative
        float helper = max(dot(light_dir, normalize(model_normal)), 0.0);

        // Diffuse contribution from this light
        diffuse_contrib += helper * mat_color * light_colors[i];


        normalizedRefLightDirection = (2.0 * helper *  normalize(model_normal)) - light_dir;
        viewDirection = normalize(model_position - camera_position);

        float dotProduct = max(dot(normalizedRefLightDirection, viewDirection), 0.0);

        specular_contrib += light_colors[i] * mat_specular * pow(dotProduct, mat_shininess);
    }


    // Combine contributions
    vec3 final_lighting = ambient_contrib + diffuse_contrib + specular_contrib;

    // Color
    FragColor = vec4(final_lighting * texture(mat_texture, model_uv).rgb, 1.0);
}
