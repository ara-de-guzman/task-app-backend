const {
  getTasks,
  setTasks,
  updateTask,
} = require("../controllers/TaskController");
const Task = require("../models/taskModels");
jest.mock("../models/taskModels");
const User = require("../models/userModel");
jest.mock("../models/userModel");

test("should get tasks for a user", async () => {
  const req = { user: { id: "user-id" } };

  const tasks = [
    {
      _id: "task-id-1",
      text: "Task 1",
      user: "user.id",
    },
    {
      _id: "task-id-2",
      text: "Task 2",
      user: "user.id",
    },
  ];

  Task.find.mockResolvedValue(tasks);
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  await getTasks(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(tasks);
});

test("should set a new task for a user", async () => {
  const req = { user: { id: "user-id" }, body: { text: "New Task" } };
  const task = { _id: "new-task-id", text: "New Task", user: "user-id" };

  Task.create.mockResolvedValue(task);

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await setTasks(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(task);
});

test("should return a 400 error for missing task text", async () => {
  const req = { user: { id: "user-id" }, body: {} };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  await expect(setTasks(req, res)).rejects.toThrow("Please enter a task");
  expect(res.status).toHaveBeenCalledWith(400);
});

test("should return a 401 error if user is not found", async () => {
  const taskId = "task-id-1";
  const userId = "non-existent-user-id";
  const req = {
    params: { id: taskId },
    user: { id: userId },
    body: { text: "Update task" },
  };

  const taskToUpdate = { _id: taskId, text: "original Task", user: "user-id" };

  Task.findById.mockResolvedValue(taskToUpdate);

  User.findById.mockResolvedValue(null);
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await expect(updateTask(req, res)).rejects.toThrow("No such user found");
  expect(res.status).toHaveBeenCalledWith(401);
});

test("should return a 401 error if user is not authorized to update the task", async () => {
  const taskId = "task-id-1";
  const userId = "user-id-2";
  const req = {
    params: { id: taskId },
    user: { id: userId },
    body: { text: "Updated task" },
  };

  const taskToUpdate = { _id: taskId, text: "original Task", user: "user-id-1" };

  Task.findById.mockResolvedValue(taskToUpdate);

  User.findById.mockResolvedValue({ _id: userId });
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await expect(updateTask(req, res)).rejects.toThrow(
    "User is not authorized to update"
  );
  expect(res.status).toHaveBeenCalledWith(401);
});
