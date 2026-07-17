const express = require('express')
const router = express.Router()
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
} = require('../controllers/expenseController')
const { protect } = require('../middleware/authMiddleware')

// IMPORTANT: /summary must be declared before the /:id route,
// otherwise Express will treat "summary" as an :id value.
router.get('/summary', protect, getSummary)

router.route('/')
  .get(protect, getExpenses)
  .post(protect, createExpense)

router.route('/:id')
  .get(protect, getExpenseById)
  .put(protect, updateExpense)
  .delete(protect, deleteExpense)

module.exports = router
