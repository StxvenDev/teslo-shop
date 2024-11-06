const imageTypes = ['jpg','png','webp']

export const fileFilter = (req : Express.Request, file: Express.Multer.File, callback: Function) => {
    console.log({file});
    if( !file ) return callback(new Error('file is empty'), false);
    const fileExtension = file.mimetype.split('/')[1];
    if(!imageTypes.includes(fileExtension))
        return callback(null, false);
    callback(null, true);
}