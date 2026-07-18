const priorities = ['low', 'medium', 'high'];

export default function validateTask(req, res, next) {
  const { title, priority, dueDate } = req.body;
  if (title !== undefined && (!String(title).trim() || String(title).trim().length > 100)) {
    return res.status(400).json({ message: 'Task title must be between 1 and 100 characters.' });
  }
  if (priority !== undefined && !priorities.includes(priority)) {
    return res.status(400).json({ message: 'Priority must be low, medium, or high.' });
  }
  if (dueDate && Number.isNaN(new Date(dueDate).getTime())) {
    return res.status(400).json({ message: 'Due date must be a valid date.' });
  }
  next();
}
