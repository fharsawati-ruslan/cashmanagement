/**
 * Agro Oasis Cash Management
 */

document.addEventListener('DOMContentLoaded', () => {
  /*
   * ========================================
   * LIVE CLOCK
   * ========================================
   */

  const clock =
  document.getElementById('liveClock') ||
  document.getElementById('headerClock')

const date = document.getElementById('liveDate')


  function updateClock() {
    const now = new Date()

    if (clock) {
      clock.textContent = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    }

    if (date) {
      date.textContent = now.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    }
  }

  updateClock()
  setInterval(updateClock, 1000)


  /*
   * ========================================
   * PASSWORD TOGGLE
   * ========================================
   */

  const password = document.getElementById('password')
  const passwordToggle = document.getElementById('passwordToggle')

  if (password && passwordToggle) {
    passwordToggle.addEventListener('click', () => {
      const isPassword = password.type === 'password'

      password.type = isPassword ? 'text' : 'password'

      passwordToggle.textContent = isPassword ? '🙈' : '👁'

      passwordToggle.setAttribute(
        'aria-label',
        isPassword
          ? 'Sembunyikan password'
          : 'Tampilkan password'
      )
    })
  }


  /*
   * ========================================
   * DARK / LIGHT MODE
   * ========================================
   */

  const themeToggle = document.getElementById('themeToggle')
  const themeIcon = document.getElementById('themeIcon')

  const savedTheme =
    localStorage.getItem('agro-oasis-theme')

  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
  }

  function updateThemeIcon() {
    if (!themeIcon) {
      return
    }

    const isDark =
      document.documentElement.classList.contains('dark')

    themeIcon.textContent = isDark ? '🌙' : '☀️'
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark')

      const isDark =
        document.documentElement.classList.contains('dark')

      localStorage.setItem(
        'agro-oasis-theme',
        isDark ? 'dark' : 'light'
      )

      updateThemeIcon()
    })
  }

  updateThemeIcon()


  /*
   * ========================================
   * DASHBOARD CLOCK
   * ========================================
   */

  const dashboardClock =
    document.getElementById('dashboardClock')

  function updateDashboardClock() {
    if (!dashboardClock) {
      return
    }

    const now = new Date()

    dashboardClock.textContent =
      now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
  }

  updateDashboardClock()
  setInterval(updateDashboardClock, 1000)


  /*
   * ========================================
   * DASHBOARD THEME
   * ========================================
   */

  const dashboardThemeToggle =
    document.getElementById('dashboardThemeToggle')

  if (dashboardThemeToggle) {
    function updateDashboardThemeIcon() {
      const isDark =
        document.documentElement.classList.contains('dark')

      dashboardThemeToggle.textContent =
        isDark ? '🌙' : '☀️'
    }

    dashboardThemeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark')

      const isDark =
        document.documentElement.classList.contains('dark')

      localStorage.setItem(
        'agro-oasis-theme',
        isDark ? 'dark' : 'light'
      )

      updateDashboardThemeIcon()
    })

    updateDashboardThemeIcon()
  }
})
