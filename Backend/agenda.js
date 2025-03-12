import Agenda from "agenda";
import PodCast from "./models/podcast.model.js";

// Connect to MongoDB
export const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "agendaJobs" },
});

// Define the task function
agenda.define("Post", async (job) => {
  const { podcastId } = job.attrs.data;
  const post = await PodCast.findById(podcastId);

  if (!post) {
    console.log(`Post ${podcastId} not found!`);
    return;
  }
  console.log(`Executing task: ${post}`);

  // Optionally update the task status after execution
  console.log("podcast",post)
  const updatedPost = await PodCast.findByIdAndUpdate(podcastId, { status: "uploaded" },{new:true});
  console.log("Updated Post in Agenda.js : ", updatedPost);

});

// Function to start Agenda
export const startAgenda = async () => {
  await agenda.start();
  console.log("Agenda started!");

  // Fetch all tasks with future scheduled dates and schedule them
  // const tasks = await Task.find({ scheduleDate: { $gte: new Date() } });
  // tasks.forEach((task) => {
  //   agenda.schedule(task.scheduleDate, "execute task", { taskId: task._id });
  // });
};


// Your function to execute
function runYourFunction(task) {
  console.log(`🚀 Running function for task: ${task.title}`);
  // Your actual function logic goes here (e.g., sending email, notification, etc.)
}