import app from './app';
import db, { initDb } from './db'; 
import dotenv from 'dotenv';
import { startScheduler, stopScheduler } from './services/scheduler.service';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initDb();
    
    startScheduler();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    const shutdown = (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      
      stopScheduler();
      
      server.close(() => {
        console.log('HTTP server closed.');
        
        db.close((err: Error | null) => {
          if (err) console.error('Error closing database:', err.message);
          else console.log('Database connection closed.');
          
          process.exit(0);
        });
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));   
    process.on('SIGTERM', () => shutdown('SIGTERM')); 

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();