import express from 'express';
import routes from './routes';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';

const morgan = require("morgan");

export default class App {
    private express: express.Application;

    constructor() {
        this.express = express();
        this.prepareEnv();
        this.middlewares();
        this.routes();
    }

    private prepareEnv() {
        dotenv.config();
        if (process.env.OVERRIDE_ENV == 'true') {
            const envConfig = dotenv.parse(fs.readFileSync('.env.prod'))
            for (const k in envConfig) {
                process.env[k] = envConfig[k]
            }
        }
    }

    private middlewares(): void {
        this.express.use(cors());
        this.express.use(express.json());
        this.express.use(morgan("dev"));
    }

    private routes(): void {
        this.express.use(routes);
    }

    public start(): void {
        const porta = process.env.PORT || 3333;
        this.express.listen(porta, () => {
            console.log(process.env.NODE_ENV == 'dev' ? `Server iniciado e escutando em http://localhost:${porta} !` : 'Server iniciado!');
        });
    }

}