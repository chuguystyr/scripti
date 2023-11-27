import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
export const protector = async (token: string) => {
    if (!token) {
        return { message: 'Unathorised'}
    };
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        return decoded;
    } catch (error) {
        return { message: 'Unathorised'}
    }
}