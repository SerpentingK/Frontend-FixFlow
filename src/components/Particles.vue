<script setup>
import { onMounted, inject } from "vue";

const selectedColor = inject("selectedColor")

const initParticles = () => {
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 200,
        density: {
          enable: true,
          value_area: window.innerWidth > 768 ? 1000 : 500,
        },
      },
      color: {
        value: "#363636",
      },
      shape: {
        type: ["circle", "triangle"],
      },
      opacity: {
        value: 1,
        anim: {
          enable: true,
          speed: 1.5,
          opacity_min: 0.1,
        },
      },
      size: {
        value: 5,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 1.5,
        },
      },
      line_linked: {
        enable: true,
        distance: 90,
        color: "#222222",
        opacity: 0.8,
        width: 2,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "top",
        random: true,
        straight: false,
        out_mode: "bounce",
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
        },
        onclick: {
          enable: true,
          mode: "remove",
        },
      },
    },
  });
};

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/particles.js";
  script.onload = initParticles;
  document.body.appendChild(script);
});
</script>

<template>
  <div id="particles-js"></div>
</template>

<style scoped>
#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}
</style>
