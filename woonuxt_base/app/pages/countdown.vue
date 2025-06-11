<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center p-8 max-w-3xl">
      <h1 class="text-4xl md:text-6xl font-bold text-black mb-8">
        <span v-if="isBeforeOpen">Store Opening Soon</span>
        <span v-else-if="isOpen">Store Open!</span>
        <span v-else>We're Closed</span>
      </h1>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="(unit, index) in timeUnits" :key="index" class="bg-white rounded-lg p-4 shadow">
          <div class="text-3xl md:text-5xl font-bold text-black">{{ unit.value }}</div>
          <div class="text-sm md:text-base text-gray-700">{{ unit.label }}</div>
        </div>
      </div>
      <p class="text-xl text-black mb-4">
        {{ statusMessage }}
      </p>
      <p class="text-lg text-gray-700">
        {{ targetTimeMessage }}
      </p>
      <p class="text-xs text-gray-400 mt-4">Central Time: {{ now.toLocaleString('en-US', { timeZone: 'America/Chicago' }) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig, useHead } from '#app'
import { useRouter } from 'vue-router'

const config = useRuntimeConfig()
const now = ref(new Date())
const openTime = ref<Date | null>(null)
const closeTime = ref<Date | null>(null)
const router = useRouter()

// Remove hardcoded event window
// const OPEN_MONTH = 5 // June (0-based)
// const OPEN_DAY = 13
// const CLOSE_MONTH = 5 // June (0-based)
// const CLOSE_DAY = 15
// const EVENT_HOUR = 21 // 9pm
// const EVENT_MINUTE = 0

async function fetchCentralTimeAndSetWindows() {
  try {
    const res = await fetch('https://worldtimeapi.org/api/timezone/America/Chicago')
    const data = await res.json()
    now.value = new Date(data.datetime)
  } catch (e) {
    now.value = new Date()
  }
  // Use config values for open/close
  openTime.value = new Date(config.public.siteOpenTime)
  closeTime.value = new Date(config.public.siteCloseTime)
}

const isBeforeOpen = computed(() => openTime.value && now.value < openTime.value)
const isOpen = computed(() => openTime.value && closeTime.value && now.value >= openTime.value && now.value < closeTime.value)
const isAfterClose = computed(() => closeTime.value && now.value >= closeTime.value)

const targetTime = computed(() => {
  if (isBeforeOpen.value && openTime.value) return openTime.value
  if (isOpen.value && closeTime.value) return closeTime.value
  return null
})

const statusMessage = computed(() => {
  if (isBeforeOpen.value) return "We are currently getting our products ready, come back on June 13th at 9pm CST to shop!"
  if (isOpen.value) return "We're open! Shop now before we close."
  return "Our store is temporarily closed."
})

const targetTimeMessage = computed(() => {
  if (isBeforeOpen.value && openTime.value) return `Opening on ${openTime.value.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}`
  if (isOpen.value && closeTime.value) return `Closing on ${closeTime.value.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}`
  return `We'll be back soon!`
})

const timeUnits = computed(() => {
  if (!targetTime.value) {
    return [
      { value: 0, label: 'Days' },
      { value: 0, label: 'Hours' },
      { value: 0, label: 'Minutes' },
      { value: 0, label: 'Seconds' }
    ]
  }
  let diff = Math.max(0, targetTime.value.getTime() - now.value.getTime())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  diff -= days * (1000 * 60 * 60 * 24)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  diff -= hours * (1000 * 60 * 60)
  const minutes = Math.floor(diff / (1000 * 60))
  diff -= minutes * (1000 * 60)
  const seconds = Math.floor(diff / 1000)
  return [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Minutes' },
    { value: seconds, label: 'Seconds' }
  ]
})

onMounted(() => {
  fetchCentralTimeAndSetWindows().then(() => {
    const timer = setInterval(() => {
      now.value = new Date(now.value.getTime() + 1000)
      // Redirect logic
      if (isOpen.value && targetTime.value && now.value >= targetTime.value) {
        // Store just closed, redirect to /countdown
        router.replace('/countdown')
      } else if (
        isOpen.value &&
        openTime.value &&
        closeTime.value &&
        now.value >= openTime.value &&
        now.value < closeTime.value
      ) {
        // Store just opened, wait 5 seconds then redirect to homepage
        setTimeout(() => {
          router.replace('/')
        }, 5000)
      }
    }, 1000)
    onUnmounted(() => {
      clearInterval(timer)
    })
  })
})

useHead({
  title: 'Store Opening Soon!'
})
</script> 