import express from "express";
// import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import pipelineRoutes from "./routes/pipelinesRoutes.js";
import subscribersRoutes from "./routes/subscribersRoutes.js";
import jobRoutes from "./routes/jobsRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import actionsRoutes from "./routes/actionsRoutes.js";
import deliveriesRoutes from "./routes/deliveriesRoutes.js";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth',authRoutes); //handles user login and signup 
app.use('/pipelines',pipelineRoutes); //handles creating new pipelines and adding actions to them
app.use('/:pipelineId/subscribers',subscribersRoutes); //handles getting and setting the subscribers for a pipeline
app.use('/jobs',jobRoutes);//handles getting the job history for a user, and all the jobs for the admin 
app.use('/webhook/',webhookRoutes); //handles the requist to the pipeline source url, creates a job, inserts it to the queue
app.use('/actions', actionsRoutes);
app.use('/deliveries',deliveriesRoutes);
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;