import express, {Application} from 'express';
// import cors from 'cors';
import morgan from 'morgan';
import userRouter from '../routes/user';
import bodyParser from 'body-parser';
import 'dotenv/config'

function configureApp(app : Application) {
    // app.use(cors()); // Enable CORS
    app.use(morgan('dev')); // HTTP request logger
    app.use(bodyParser.json()); // Parse JSON request bodies
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use([userRouter]);
}

export async function initialiseServer() {
    const app = express();
    const port = process.env.PORT || 4000;

    configureApp(app);

    return new Promise((resolve, reject) => {
        try {
            const server = app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
                resolve(app);
            });

            const gracefulShutdown = () => {
                console.log('Shutting down server gracefully...');
                server.close((err) => {
                    if (err) {
                        console.error('Error during shutdown', err);
                        process.exit(1);
                    }
                    process.exit(0);
                });
            };

            process.on('SIGTERM', gracefulShutdown);
            process.on('SIGINT', gracefulShutdown);
        } catch (error) {
            console.error('Error starting the server:', error);
            reject(error);
        }
    });
}