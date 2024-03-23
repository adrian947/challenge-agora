import jwt, { Secret } from 'jsonwebtoken';

interface DecodedToken {
    userId: string;    
}

export const decodedToken = (token: string): DecodedToken => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken;
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
};
