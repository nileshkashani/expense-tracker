const Expense = require('../models/Expense')
const asyncHandler = require('../middleware/asyncHandler')
const { protect } = require('../middleware/authMiddleware')

// @desc    Get all expenses for the current user (optionally filtered)
// @route   GET /api/expenses
// @query   category, from, to, search
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const { category, from, to, search } = req.query
  const filter = { user: req.user._id }

  if (category) filter.category = category
  if (from || to) {
    filter.date = {}
    if (from) filter.date.$gte = new Date(from)
    if (to) filter.date.$lte = new Date(to)
  }
  if (search) filter.title = { $regex: search, $options: 'i' }

  const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 })
  res.json(expenses)
})

// @desc    Get a single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id })
  if (!expense) {
    res.status(404)
    throw new Error('Expense not found')
  }
  res.json(expense)
})

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date, notes } = req.body
  const expense = await Expense.create({
    title,
    amount,
    category,
    date,
    notes,
    user: req.user._id,
  })
  res.status(201).json(expense)
})

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id })
  if (!expense) {
    res.status(404)
    throw new Error('Expense not found')
  }

  const { title, amount, category, date, notes } = req.body
  if (title !== undefined) expense.title = title
  if (amount !== undefined) expense.amount = amount
  if (category !== undefined) expense.category = category
  if (date !== undefined) expense.date = date
  if (notes !== undefined) expense.notes = notes

  const updated = await expense.save()
  res.json(updated)
})

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id })
  if (!expense) {
    res.status(404)
    throw new Error('Expense not found')
  }

  await expense.deleteOne()
  res.json({ message: 'Expense deleted', id: req.params.id })
})

// @desc    Summary stats: total spent, this month, top category, avg/day, category breakdown
// @route   GET /api/expenses/summary
// @access  Public
const getSummary = asyncHandler(async (req, res) => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const matchUser = { user: req.user._id }

  const [totalAgg, monthAgg, byCategoryAgg, thirtyDayAgg] = await Promise.all([
    Expense.aggregate([
      { $match: matchUser },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { ...matchUser, date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: matchUser },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]),
    Expense.aggregate([
      { $match: { ...matchUser, date: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ])

  const totalSpent = totalAgg[0]?.total || 0
  const monthSpent = monthAgg[0]?.total || 0
  const avgPerDay = (thirtyDayAgg[0]?.total || 0) / 30

  const byCategory = byCategoryAgg.map((c) => ({ category: c._id, total: c.total }))
  const topCategory = byCategory[0] ? { category: byCategory[0].category, total: byCategory[0].total } : null

  res.json({
    totalSpent,
    monthSpent,
    avgPerDay,
    topCategory,
    byCategory,
  })
})

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
}
