import type { HttpContext } from '@adonisjs/core/http'
import CashTransaction from '#models/cash_transaction'

export default class DashboardController {
  /**
   * ============================================================
   * DASHBOARD
   * ============================================================
   */
  async index({ view, auth }: HttpContext) {
    const user = auth.user

    const [
      cashInResult,
      cashOutResult,
      bankInResult,
      bankOutResult,
      latestTransactions,
    ] = await Promise.all([
      CashTransaction.query()
        .where('status', 'posted')
        .where('accountType', 'cash')
        .where('type', 'cash_in')
        .sum('amount as total'),

      CashTransaction.query()
        .where('status', 'posted')
        .where('accountType', 'cash')
        .where('type', 'cash_out')
        .sum('amount as total'),

      CashTransaction.query()
        .where('status', 'posted')
        .where('accountType', 'bank')
        .where('type', 'cash_in')
        .sum('amount as total'),

      CashTransaction.query()
        .where('status', 'posted')
        .where('accountType', 'bank')
        .where('type', 'cash_out')
        .sum('amount as total'),

      CashTransaction.query()
        .where('status', 'posted')
        .preload('creator')
        .orderBy('transactionDate', 'desc')
        .orderBy('id', 'desc')
        .limit(5),
    ])

    const totalCashIn = Number(
      cashInResult[0]?.$extras.total ?? 0
    )

    const totalCashOut = Number(
      cashOutResult[0]?.$extras.total ?? 0
    )

    const totalBankIn = Number(
      bankInResult[0]?.$extras.total ?? 0
    )

    const totalBankOut = Number(
      bankOutResult[0]?.$extras.total ?? 0
    )

    const cashBalance =
      totalCashIn - totalCashOut

    const bankBalance =
      totalBankIn - totalBankOut

    const summary = {
      cashBalance,
      totalCashIn,
      totalCashOut,
      bankBalance,
      latestTransactions,
    }

    return view.render('pages/dashboard', {
      user,
      summary,
      transactions: latestTransactions,
    })
  }

  /**
   * ============================================================
   * DASHBOARD SUMMARY API
   * ============================================================
   */
  async summary({ response }: HttpContext) {
    const [
      cashInResult,
      cashOutResult,
      bankInResult,
      bankOutResult,
      latestTransactions,
    ] = await Promise.all([
      CashTransaction.query()
        .where('status', 'posted')
        .where('accountType', 'cash')
        .where('type', 'cash_in')
        .sum('amount as total'),

      CashTransaction.query()
        .where('status', 'posted')
        .where('accountType', 'cash')
        .where('type', 'cash_out')
        .sum('amount as total'),

      CashTransaction.query()
        .where('status', 'posted')
        .where('accountType', 'bank')
        .where('type', 'cash_in')
        .sum('amount as total'),

      CashTransaction.query()
        .where('status', 'posted')
        .where('accountType', 'bank')
        .where('type', 'cash_out')
        .sum('amount as total'),

      CashTransaction.query()
        .where('status', 'posted')
        .preload('creator')
        .orderBy('transactionDate', 'desc')
        .orderBy('id', 'desc')
        .limit(5),
    ])

    const totalCashIn = Number(
      cashInResult[0]?.$extras.total ?? 0
    )

    const totalCashOut = Number(
      cashOutResult[0]?.$extras.total ?? 0
    )

    const totalBankIn = Number(
      bankInResult[0]?.$extras.total ?? 0
    )

    const totalBankOut = Number(
      bankOutResult[0]?.$extras.total ?? 0
    )

    return response.ok({
      cashBalance:
        totalCashIn - totalCashOut,

      totalCashIn,

      totalCashOut,

      bankBalance:
        totalBankIn - totalBankOut,

      latestTransactions,
    })
  }
}
