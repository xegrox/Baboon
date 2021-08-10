<template>
  <div id="root" class="h-screen overflow-auto" @scroll="onScroll">
    <Navbar active="HOME" :showTryButton="!heroInView"/>
    <div ref="hero" id="hero" class="h-screen bg-gray-900 relative">
      <div class="w-full h-full flex flex-col items-center justify-center gap-10">
        <div class="w-1/6 h-20" id="logo"/>
        <p class="font-mono text-white tracking-widest">Edit code remotely</p>
      </div>
      <div class="absolute flex flex-col items-center gap-14 bottom-0 left-1/2 transform -translate-x-1/2 transition-opacity opacity-0" :class="{ 'opacity-75': animDone }">
        <a href="/app" class="font-mono text-gray-300 border border-gray-600 py-2 px-4 rounded-lg bg-opacity-20 bg-gray-600 hover:bg-opacity-100 transition-colors">Try now</a>
        <MoreHorizontalIcon class="text-white h-5 w-5 mb-10 animate-bounce"/>
      </div>
    </div>
    <div id="features" class="bg-gray-800">
      <div class="flex h-screen items-center gap-20 p-12">
        <div class="w-3/5">
          <video class="rounded-lg shadow-2xl" src="demo_1.mp4" autoplay muted loop/>
        </div>
        <div class="w-2/5">
          <p class="text-4xl font-mono text-white">Autocomplete on input</p>
          <p class="font-mono text-gray-200 mt-10 leading-loose">Obtain code suggestions as you type<br>Over 100+ languages supported</p>
        </div>
      </div>
      <div class="flex h-screen items-center gap-20 p-12">
        <div class="w-3/5">
          <video class="rounded-lg shadow-2xl" src="demo_2.mp4" autoplay muted loop/>
        </div>
        <div class="w-2/5">
          <p class="text-4xl font-mono text-white">Connect to language server</p>
          <p class="font-mono text-gray-200 mt-10 leading-loose">Plug in your lsp server and obtain<br>live diagnostics, autocomplete<br>and hover tooltips</p>
        </div>
      </div>
      <div id="screenshots" class="h-screen flex flex-col items-center p-12 gap-16">
        <p class="flex-none text-4xl font-mono text-white">Screenshots</p>
        <Carousel class="w-5/6" :autoplay="5000" :transition="1000" :wrap-around="true">
          <Slide v-for="url in screenshots" :key="url">
            <div>
              <img :src="url + '.png'" class="rounded-lg shadow-2xl">
            </div>
          </Slide>
          <template #addons>
            <Navigation>
              <template #next>
                <ChevronRightIcon class="text-gray-400"/>
              </template>
              <template #prev>
                <ChevronLeftIcon class="text-gray-400"/>
              </template>
            </Navigation>
            <Pagination class="mt-5"/>
          </template>
        </Carousel>
      </div>
    </div>
    <div id="contact" class="bg-gray-700 w-full flex flex-col items-center py-20 gap-10">
      <div class="flex gap-10">
        <div class="flex items-center gap-2 group cursor-pointer">
          <GithubIcon class="text-gray-400 group-hover:text-gray-200 transition-colors"/>
          <p class="text-gray-400 font-mono group-hover:text-gray-200 transition-colors">Github</p>
        </div>
        <div class="flex items-center gap-2 group cursor-pointer">
          <TwitterIcon class="text-gray-400 group-hover:text-gray-200 transition-colors"/>
          <p class="text-gray-400 font-mono group-hover:text-gray-200 transition-colors">Twitter</p>
        </div>
        <div class="flex items-center gap-2 group cursor-pointer">
          <InstagramIcon class="text-gray-400 group-hover:text-gray-200 transition-colors"/>
          <p class="text-gray-400 font-mono group-hover:text-gray-200 transition-colors">Instagram</p>
        </div>
      </div>
      <hr class="w-1/2 border-gray-600"/>
      <p class="text-gray-200 text-xl font-mono">Want to receive newsletters about upcoming features?</p>
      <form @submit.prevent="subscribe()">
        <div class="flex items-center">
          <p class="text-gray-300 text-base font-mono mr-8">Subscribe now</p>
          <input class="text-gray-200 bg-gray-800 h-14 p-5 rounded-l-lg outline-none" placeholder="Your email" type="email" required/>
          <button type="submit" class="h-14 p-4 bg-gray-500 rounded-r-lg hover:bg-opacity-70 transition relative" :class="{ 'bg-green-300 pointer-events-none': subscribed }">
            <ChevronRightIcon class="text-gray-800 w-full h-full transition-opacity" :class="{ 'opacity-0': subscribed }"/>
            <CheckIcon class="absolute p-4 text-gray-800 w-full h-full top-0 left-0 transition-colors" :class="subscribed ? 'opacity-100': 'opacity-0'"/>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Navbar from './Navbar.vue'
import Vivus from 'vivus'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { MoreHorizontalIcon, ChevronRightIcon, ChevronLeftIcon, GithubIcon, TwitterIcon, InstagramIcon, CheckIcon } from '@zhuowenli/vue-feather-icons'

export default defineComponent({
  components: {
    MoreHorizontalIcon,
    Carousel,
    Slide,
    Pagination,
    Navigation,
    ChevronRightIcon,
    ChevronLeftIcon,
    GithubIcon,
    TwitterIcon,
    InstagramIcon,
    CheckIcon,
    Navbar
  },
  setup() {
    let animDone = ref(false)
    const hero = ref({}) // Will be replaced with HTMLElement of ref hero

    // Show try button in navbar when hero is out of view
    const heroInView = ref(true)
    function onScroll() {
      let heroRect = (hero.value as HTMLElement).getBoundingClientRect()
      heroInView.value = heroRect.bottom > 0
    }

    // For the carousel
    let screenshots = ['screenshot_1', 'screenshot_2', 'screenshot_3', 'screenshot_4', 'screenshot_5', 'screenshot_6']

    // If true will show a tick
    let subscribed = ref(false)

    // Init animations
    onMounted(() => {
      let anim = new Vivus('logo', {
        duration: 200,
        file: 'logo.svg',
        start: 'manual',
        animTimingFunction: Vivus.EASE_OUT
      })
      setTimeout(() => {
        anim.play(1, () => {
          animDone.value = true
        })
      }, 500)
    })

    return {
      animDone,
      screenshots,
      subscribed,
      subscribe: () => {
        subscribed.value = true
        setTimeout(() => {
          subscribed.value = false
        }, 3000)
        return false
      },
      hero,
      onScroll,
      showDropdown: ref(false),
      heroInView
    }
  }
})
</script>

<style>
#root {
  scrollbar-width: none;
  scroll-behavior: smooth;
}

#root::-webkit-scrollbar {
  display: none;
}

.carousel__prev, .carousel__next {
  /* @apply bg-gray-700 bg-opacity-50 */
  background-color: rgba(56, 56, 56, 0.5);
}

.carousel__pagination-button {
  /* @apply bg-gray-700 rounded-lg transition-colors */
  border-radius: 0.5rem;
  background-color: rgb(56, 56, 56);
  transition: background-color 0.25s;
}

.carousel__pagination-button--active {
  /* @apply bg-gray-600 */
  background-color: rgb(80, 80, 80)
}
</style>
