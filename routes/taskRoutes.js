const express = require("express");
const router = express.Router();
const {
  getTasks,
  setTasks,
  updateTask,
  deleteTask,
} = require("../controllers/TaskController");

const { protect } = require("../middleware/authMiddleware");

router.get("/",protect, getTasks);
router.post("/",protect,setTasks);
router.put("/:id",protect, updateTask);
router.delete("/:id",protect, deleteTask);

module.exports = router;
