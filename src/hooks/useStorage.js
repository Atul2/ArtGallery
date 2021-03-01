import { useState, useEffect } from 'react';
import { dbStorage, db, timestamp } from '../firebase';

const useStorage = (file) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        //references
        const storageRef = dbStorage.ref(file.name);
        const dbCollection = db.collection('artGallery');


        storageRef.put(file).on('state_changed', (snap) => {
            let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(percentage);
        }, (err) => {
            setError(err)
        }, async() => {
                const url = await storageRef.getDownloadURL();
                const createdAt = timestamp();
                dbCollection.add({ url, createdAt });
            setUrl(url);
        })
    }, [file]);

    return {progress, url, error}
}

export default useStorage;