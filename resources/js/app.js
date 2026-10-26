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


/**
 * =========================================================
 * Dashboard realtime
 * =========================================================
 */

function formatRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

function updateDashboardSummary(data) {
  const cashBalance = document.getElementById('cashBalance')
  const totalCashIn = document.getElementById('totalCashIn')
  const totalCashOut = document.getElementById('totalCashOut')
  const bankBalance = document.getElementById('bankBalance')

  if (cashBalance) {
    cashBalance.textContent = formatRupiah(data.cashBalance)
  }

  if (totalCashIn) {
    totalCashIn.textContent = formatRupiah(data.totalCashIn)
  }

  if (totalCashOut) {
    totalCashOut.textContent = formatRupiah(data.totalCashOut)
  }

  if (bankBalance) {
    bankBalance.textContent = formatRupiah(data.bankBalance)
  }

  updateLatestTransactions(data.latestTransactions || [])
}

function updateLatestTransactions(transactions) {
  const container = document.getElementById(
    'transactionsContainer'
  )

  if (!container) {
    return
  }

  if (transactions.length === 0) {
    container.innerHTML = `
      <div id="emptyTransactionState">

        <div class="empty-icon">
          💸
        </div>

        <h3>
          Belum ada transaksi
        </h3>

        <p>
          Transaksi Cash In dan Cash Out
          yang kamu catat akan muncul di sini.
        </p>

        <a
          href="/transactions/create"
          class="empty-button"
        >
          Catat Cash In
        </a>

      </div>
    `

    return
  }

  container.innerHTML = `
    <div class="dashboard-transaction-list">

      ${transactions
        .map((transaction) => {
          const isCashIn = transaction.type === 'cash_in'

          return `
            <a
              href="/transactions/${transaction.id}"
              class="dashboard-transaction-item"
            >

              <div class="dashboard-transaction-icon">
                ${isCashIn ? '↗' : '↘'}
              </div>

              <div class="dashboard-transaction-info">

                <strong>
                  ${escapeHtml(transaction.transactionCode)}
                </strong>

                <small>
                  ${escapeHtml(transaction.category)}
                  •
                  ${escapeHtml(transaction.transactionDate)}
                </small>

              </div>

              <div
                class="dashboard-transaction-amount ${
                  isCashIn ? 'income' : 'expense'
                }"
              >
                ${isCashIn ? '+' : '-'}
                ${formatRupiah(transaction.amount)}
              </div>

            </a>
          `
        })
        .join('')}

    </div>
  `
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

async function refreshDashboard() {
  const dashboard = document.getElementById('cashBalance')

  if (!dashboard) {
    return
  }

  try {
    const response = await fetch('/dashboard/summary', {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return
    }

    const data = await response.json()

    updateDashboardSummary(data)
  } catch (error) {
    console.error(
      'Dashboard realtime update failed:',
      error
    )
  }
}

if (document.getElementById('cashBalance')) {
  setInterval(refreshDashboard, 10000)
}
