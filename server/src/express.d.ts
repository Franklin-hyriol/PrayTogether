import { User } from './models/User'; // Chemin vers ton modèle User

declare global {
    namespace Express {
        interface User extends User { } // Étend Express.User avec ton modèle User
    }
}
