import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
  // Allow the countdown page and error page
  if (to.path === '/countdown' || to.path === '/error') {
    return
  }

  const config = useRuntimeConfig()
  let now = new Date()
  try {
    const res = await fetch('https://worldtimeapi.org/api/timezone/America/Chicago')
    const data = await res.json()
    now = new Date(data.datetime)
  } catch (e) {
    // fallback to local time
  }
  const openTime = new Date(config.public.siteOpenTime)
  const closeTime = new Date(config.public.siteCloseTime)

  // If now is before openTime or after closeTime, redirect to countdown
  if (now < openTime || now >= closeTime) {
    return navigateTo('/countdown')
  }
}) 