import { Router } from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res, next) => { try { res.json(await Task.find({ user: req.userId }).sort({ completed: 1, dueDate: 1, createdAt: -1 })); } catch (e) { next(e); } });
router.post('/', async (req, res, next) => { try { res.status(201).json(await Task.create({ ...req.body, user: req.userId })); } catch (e) { next(e); } });
router.patch('/:id', async (req, res, next) => { try { const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true, runValidators: true }); if (!task) return res.status(404).json({ message: 'Task not found.' }); res.json(task); } catch (e) { next(e); } });
router.delete('/:id', async (req, res, next) => { try { const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId }); if (!task) return res.status(404).json({ message: 'Task not found.' }); res.status(204).end(); } catch (e) { next(e); } });

export default router;
