import fs from 'fs';
import path from 'path';

export const uploadService = {
    async saveFile(file) {
        if (!file) return null;
        
        return {
            filename: file.filename,
            originalname: file.originalname,
            size: file.size,
            path: file.path,
            url: `/uploads/${file.filename}`
        };
    },
    
    async deleteFile(filename) {
        const filePath = path.join('uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    }
};