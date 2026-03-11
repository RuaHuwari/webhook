import express from "express";
// import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import pipelineRoutes from "./routes/pipelinesRoutes.js";
import subscribersRoutes from "./routes/subscribersRoutes.js";
const app = express();
app.use(express.json());
app.use('/auth',authRoutes); //handles user login and signup 
app.use('/pipelines',pipelineRoutes);
app.use('/:pipelineId/subscribers',subscribersRoutes);
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;