import { JwtPayload } from "./jwt";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
            };
            currentUser?: {
                id: number,
                email: string,
                name: string,
                role: string,
            };
        }
    }
}