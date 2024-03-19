
#define SEGMENTS 44.0
#define PI 3.141592653589

uniform float uTime;
uniform vec2 hover;
uniform sampler2D uTex;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float hoverState;

varying vec2 vUv;


// cosine based palette, 4 vec3 params
vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}


void main(void)
{
    vec2 uv = vUv * 2.0 - 1.0; // Ajuste para centrar el caleidoscopio

	
    // make mouse
    vec2 mouse = hover ;
    
    // get angle and radius
    float radius = length(uv) * mix(1.0, 2.0, mouse.x);
    float angle = atan(uv.y, uv.x); // return uv.y/uv.x
    
    // get a segment
    angle /= PI * 2.0;
    angle *= SEGMENTS;
    
    // repeat segment
    if (mod(angle, 2.0) >= 1.0) {
        angle = fract(angle); // return ej. 5.5 return .5
    } else {
        angle = 1.0 - fract(angle);
    }
    
    angle += uTime * 0.1;
    angle += mouse.y;
    
    // unsquash segment
    angle /= SEGMENTS;
    angle *= PI * 2.0;
        
    vec2 point = vec2(radius * cos(angle), radius * sin(angle));
    point *= vec2(1.0, 1000.0 / 1500.0);
    point = fract(point);    

    vec4 color = texture2D(uTex, point);
    color.rgb*=palette(length(point+mouse)+uTime*.1);
    
    gl_FragColor = color;
}