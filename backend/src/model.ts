import mongoose, { Document, Schema } from 'mongoose';

interface ITask extends Document {
    todo: string;
}

const TaskSchema: Schema = new Schema({
    todo: {
        type: String,
        required: true
    }
});

export default mongoose.model<ITask>('Task', TaskSchema);
