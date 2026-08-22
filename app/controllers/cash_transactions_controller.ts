import type { HttpContext } from '@adonisjs/core/http'
import CashTransaction from '#models/cash_transaction'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export default class CashTransactionsController {
  /**
   * ============================================================
   * DAFTAR TRANSAKSI
   * ============================================================
   */
  async index({ view }: HttpContext) {
    const transactions = await CashTransaction.query()
      .preload('creator')
      .orderBy('transactionDate', 'desc')
      .orderBy('id', 'desc')

    return view.render('pages/transactions/index', {
      transactions,
    })
  }

  /**
   * ============================================================
   * FORM TAMBAH TRANSAKSI
   * ============================================================
   */
  async create({ request, view }: HttpContext) {
    const type = request.input('type', 'cash_in')

    const transactionDate = DateTime.now().toFormat('yyyy-MM-dd')

    return view.render('pages/transactions/create', {
      type,
      transactionDate,
    })
  }

  /**
   * ============================================================
   * SIMPAN TRANSAKSI
   * ============================================================
   */
  async store({
    request,
    response,
    auth,
    session,
  }: HttpContext) {
    /**
     * ------------------------------------------------------------
     * Ambil input
     * ------------------------------------------------------------
     */
    const type = request.input('type')
    const transactionDate = request.input('transactionDate')
    const category = request.input('category')
    const manualCategory = request.input('manualCategory')
    const amount = request.input('amount')
    const accountType = request.input('accountType', 'cash')
    const source = request.input('source')
    const description = request.input('description')
    const referenceNumber = request.input('referenceNumber')

    /**
     * ------------------------------------------------------------
     * Tentukan kategori
     *
     * Kalau user memilih "manual", gunakan manualCategory.
     * Kalau user memilih kategori biasa, gunakan category.
     * ------------------------------------------------------------
     */
    let finalCategory = category

    if (category === '__manual__') {
      finalCategory = manualCategory
    }

    /**
     * ------------------------------------------------------------
     * Validasi tipe transaksi
     * ------------------------------------------------------------
     */
    if (!['cash_in', 'cash_out'].includes(type)) {
      session.flash('errors', {
        type: 'Jenis transaksi tidak valid.',
      })

      return response.redirect().back()
    }

    /**
     * ------------------------------------------------------------
     * Validasi tanggal
     * ------------------------------------------------------------
     */
    if (!transactionDate) {
      session.flash('errors', {
        transactionDate: 'Tanggal transaksi wajib diisi.',
      })

      return response.redirect().back()
    }

    const parsedDate = DateTime.fromISO(transactionDate)

    if (!parsedDate.isValid) {
      session.flash('errors', {
        transactionDate: 'Tanggal transaksi tidak valid.',
      })

      return response.redirect().back()
    }

    /**
     * ------------------------------------------------------------
     * Validasi kategori
     * ------------------------------------------------------------
     */
    if (!finalCategory || !String(finalCategory).trim()) {
      session.flash('errors', {
        category: 'Kategori transaksi wajib diisi.',
      })

      return response.redirect().back()
    }

    finalCategory = String(finalCategory).trim()

    /**
     * ------------------------------------------------------------
     * Validasi nominal
     * ------------------------------------------------------------
     */
    const numericAmount = Number(
      String(amount ?? '').replace(/[^\d.-]/g, '')
    )

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      session.flash('errors', {
        amount: 'Nominal harus lebih besar dari 0.',
      })

      return response.redirect().back()
    }

    /**
     * ------------------------------------------------------------
     * Validasi account type
     * ------------------------------------------------------------
     */
    if (!['cash', 'bank'].includes(accountType)) {
      session.flash('errors', {
        accountType: 'Jenis sumber dana tidak valid.',
      })

      return response.redirect().back()
    }

    /**
     * ------------------------------------------------------------
     * Generate transaction code
     *
     * CI = Cash In
     * CO = Cash Out
     * ------------------------------------------------------------
     */
    const prefix = type === 'cash_in' ? 'CI' : 'CO'

    const today = DateTime.now().toFormat('yyyyMMdd')

    const lastTransaction = await CashTransaction.query()
      .where('type', type)
      .where(
        'transactionCode',
        'like',
        `${prefix}-${today}-%`
      )
      .orderBy('id', 'desc')
      .first()

    let sequence = 1

    if (lastTransaction) {
      const parts = lastTransaction.transactionCode.split('-')

      const lastSequence = Number(parts[2])

      if (Number.isFinite(lastSequence)) {
        sequence = lastSequence + 1
      }
    }

    const transactionCode =
      `${prefix}-${today}-${String(sequence).padStart(4, '0')}`

    /**
     * ------------------------------------------------------------
     * Upload invoice / bukti transaksi
     *
     * Local storage dahulu.
     *
     * storage/uploads/invoices/YYYY/MM/
     * ------------------------------------------------------------
     */
    let attachmentPath: string | null = null
    let attachmentOriginalName: string | null = null
    let attachmentContentType: string | null = null

    const invoice = request.file('invoice', {
      size: '5mb',
      extnames: [
        'jpg',
        'jpeg',
        'png',
        'webp',
        'pdf',
      ],
    })

    if (invoice) {
      /**
       * ----------------------------------------------------------
       * Validasi file
       * ----------------------------------------------------------
       */
      if (!invoice.isValid) {
        session.flash('errors', {
          invoice:
            invoice.errors[0]?.message ??
            'File invoice tidak valid.',
        })

        return response.redirect().back()
      }

      /**
       * ----------------------------------------------------------
       * Folder
       * ----------------------------------------------------------
       */
      const year = DateTime.now().toFormat('yyyy')
      const month = DateTime.now().toFormat('MM')

      const uploadDirectory = path.join(
        app.makePath('storage'),
        'uploads',
        'invoices',
        year,
        month
      )

      await fs.mkdir(uploadDirectory, {
        recursive: true,
      })

      /**
       * ----------------------------------------------------------
       * Nama file
       * ----------------------------------------------------------
       */
      const extension = invoice.extname || 'bin'

      const fileName =
        `${transactionCode}-${randomUUID()}.${extension}`

      /**
       * ----------------------------------------------------------
       * Simpan file
       * ----------------------------------------------------------
       */
      try {
        await invoice.move(uploadDirectory, {
          name: fileName,
        })
      } catch (error) {
        console.error('UPLOAD INVOICE ERROR:', error)

        session.flash('errors', {
          invoice:
            'Gagal menyimpan file invoice.',
        })

        return response.redirect().back()
      }

      /**
       * ----------------------------------------------------------
       * Path relatif database
       * ----------------------------------------------------------
       */
      attachmentPath = path.join(
        'uploads',
        'invoices',
        year,
        month,
        fileName
      )

      attachmentOriginalName =
        invoice.clientName ?? null

      attachmentContentType =
        invoice.type ?? null
    }

    /**
     * ------------------------------------------------------------
     * Simpan transaksi
     * ------------------------------------------------------------
     */
    await CashTransaction.create({
      transactionCode,

      type,

      transactionDate: parsedDate,

      category: finalCategory,

      amount: numericAmount,

      accountType,

      source:
        source && String(source).trim()
          ? String(source).trim()
          : null,

      description:
        description && String(description).trim()
          ? String(description).trim()
          : null,

      referenceNumber:
        referenceNumber &&
        String(referenceNumber).trim()
          ? String(referenceNumber).trim()
          : null,

      attachmentPath,

      attachmentOriginalName,

      attachmentContentType,

      status: 'posted',

      createdBy:
        auth.user?.id ?? null,
    })

    /**
     * ------------------------------------------------------------
     * Success
     * ------------------------------------------------------------
     */
    session.flash(
      'success',
      `Transaksi ${transactionCode} berhasil disimpan.`
    )

    return response
      .redirect()
      .toRoute('transactions.index')
  }

  /**
   * ============================================================
   * DETAIL TRANSAKSI
   * ============================================================
   */
  async show({
    params,
    response,
    view,
  }: HttpContext) {
    const transaction =
      await CashTransaction.query()
        .where('id', params.id)
        .preload('creator')
        .first()

    if (!transaction) {
      return response.notFound(
        'Transaksi tidak ditemukan'
      )
    }

    return view.render(
      'pages/transactions/show',
      {
        transaction,
      }
    )
  }
}
