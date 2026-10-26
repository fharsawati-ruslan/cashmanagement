import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column,
} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class CashTransaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare transactionCode: string

  @column()
  declare type: 'cash_in' | 'cash_out'

  @column.date()
  declare transactionDate: DateTime

  @column()
  declare category: string

  @column()
  declare amount: number

  @column()
  declare accountType: 'cash' | 'bank'

  @column()
  declare source: string | null

  @column()
  declare description: string | null

  @column()
  declare referenceNumber: string | null

  @column()
  declare attachmentPath: string | null

  @column()
  declare attachmentOriginalName: string | null

  @column()
  declare attachmentContentType: string | null

  @column()
  declare status: 'posted' | 'cancelled'

  /**
   * Foreign key ke users.id
   *
   * Database:
   * cash_transactions.created_by
   */
  @column()
  declare createdBy: number | null

  /**
   * User yang membuat transaksi.
   *
   * Penting:
   * foreignKey harus diarahkan ke createdBy,
   * bukan default userId.
   */
  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  declare creator: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
