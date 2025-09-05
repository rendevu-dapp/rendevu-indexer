// core
import { join } from "path";
// imports
import { Queue, Worker } from "bullmq";

// configs
import { redisConnection } from "./redis";

// types
import { EventJobData, PoapJobData } from "../types";

// queue for syncing events
export const syncEventsQueue = new Queue<EventJobData>("sync-events", {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 20,
    removeOnFail: 100,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, // 5 second initial delay
    },
  },
});

// queue for syncing poaps
export const syncPoapsQueue = new Queue<PoapJobData>("sync-poaps", {
  connection: redisConnection,
  streams: {
    events: {
      maxLen: 1000, // limit the number of events in the stream
    },
  },
  defaultJobOptions: {
    removeOnComplete: 20,
    removeOnFail: 100,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, // 5 second initial delay
    },
  },
});

// worker for syncing events
const syncEventsWorkerPath = join(
  __dirname,
  "..",
  "workers",
  `sync-events${__filename.endsWith(".js") ? ".js" : ".ts"}`
);
export const syncEventsWorker = new Worker<EventJobData>(
  "sync-events",
  syncEventsWorkerPath,
  {
    connection: redisConnection,
    concurrency: 5,
    useWorkerThreads: true,
    name: "sync-events-worker",
  }
);

// worker for syncing poaps
const syncPoapsWorkerPath = join(
  __dirname,
  "..",
  "workers",
  `sync-poaps${__filename.endsWith(".js") ? ".js" : ".ts"}`
);
export const syncPoapsWorker = new Worker<PoapJobData>(
  "sync-poaps",
  syncPoapsWorkerPath,
  {
    connection: redisConnection,
    concurrency: 5,
    useWorkerThreads: true,
    name: "sync-poaps-worker",
  }
);

// simple stream consumer
let streamRunning = false;

async function consumePoapStream() {
  const client = redisConnection.duplicate();
  let lastId = '$'; // use '$' to only read new messages

  console.log('🚀 starting poap stream consumer...');
  streamRunning = true;

  // clean any existing active jobs
  // await syncPoapsQueue.clean(1000, 0, "active");

  while (streamRunning) {
    try {
      const res = await client.xread(
        'COUNT', 10,
        'BLOCK', 5000,
        'STREAMS', 'sync-poaps-stream', lastId
      );

      if (res) {
        for (const [streamName, messages] of res) {
          for (const [id, fields] of messages) {
            lastId = id;
            
            try {
              // redis stream fields come as [key1, value1, key2, value2, ...]
              // convert to object first
              const messageData: Record<string, string> = {};
              for (let i = 0; i < fields.length; i += 2) {
                messageData[fields[i]] = fields[i + 1];
              }
              
              const jobName = messageData.name || 'sync-poap';
              const jobDataStr = messageData.data || '{}';
              const jobData = JSON.parse(jobDataStr);
              
              console.log(`📥 processing stream message ${id}: ${jobName}`);
              
              // add to bullmq queue
              const job = await syncPoapsQueue.add(jobName, jobData);
              console.log(`✅ added job ${jobName} to queue (ID: ${job.id})`);
              
            } catch (error) {
              console.error(`❌ error processing message ${id}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ stream consumer error:', error);
      // small delay before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  await client.quit();
  console.log('🛑 poap stream consumer stopped');
}

// start the consumer
export async function startPoapStreamConsumer() {
  if (!streamRunning) {
    consumePoapStream().catch(console.error);
  }
}

// stop the consumer
export function stopPoapStreamConsumer() {
  streamRunning = false;
}

syncEventsWorker.on("active", (job) => {
  console.log(`🔄 processing sync events job ${job.id}`);
});

syncEventsWorker.on("completed", (job) => {
  console.log(`✅ completed sync events job ${job.id}`);
});

syncPoapsWorker.on("failed", (job, err) => {
  console.error(`❌ sync poaps job ${job?.id} failed:`, err.message);
});

syncPoapsWorker.on("active", (job) => {
  console.log(`🔄 processing sync poaps job ${job.id}`);
});

syncPoapsWorker.on("completed", (job) => {
  console.log(`✅ completed sync poaps job ${job.id}`);
});

// auto-start the stream consumer
startPoapStreamConsumer();

// cleanup on exit
process.on('SIGINT', () => {
  console.log('🛑 shutting down...');
  stopPoapStreamConsumer();
  
  Promise.all([
    syncEventsWorker.close(),
    syncPoapsWorker.close()
  ]).then(() => {
    console.log('✅ cleanup completed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 received sigterm...');
  stopPoapStreamConsumer();
  
  Promise.all([
    syncEventsWorker.close(),
    syncPoapsWorker.close()
  ]).then(() => {
    console.log('✅ graceful shutdown completed');
    process.exit(0);
  });
});