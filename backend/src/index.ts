import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import TaskSchema from './model';

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*'
}));

mongoose.connect('mongodb+srv://kiran:kiran@todolist.von05st.mongodb.net/?retryWrites=true&w=majority&appName=todolist')
    .then(() => console.log('DB connected'))
    .catch((error) => console.error('DB connection error:', error));

app.post('/addtask', async (req: Request, res: Response) => {
    const { todo } = req.body;
    try {
        const newData = new TaskSchema({
            todo: todo
        });
        await newData.save();
        return res.json(await TaskSchema.find());
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/gettask', async (req: Request, res: Response) => {
    try {
        return res.json(await TaskSchema.find());
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        await TaskSchema.findByIdAndDelete(req.params.id);
        return res.json(await TaskSchema.find());
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/update/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { todo } = req.body;
  if (!todo) {
    return res.status(400).send('Task content is required');
  }

  try {
    const updatedTask = await TaskSchema.findByIdAndUpdate(id, { todo }, { new: true });
    if (!updatedTask) {
      return res.status(404).send('Task not found');
    }

    const allTasks = await TaskSchema.find();
    return res.json(allTasks);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).send('Error updating task');
  }
});

  
app.listen(5000, () => console.log("Server is running...."));
