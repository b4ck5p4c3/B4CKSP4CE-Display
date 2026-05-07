import React, {useEffect, useState} from 'react';
import VideoUploader from '../components/videoUploader';
import VideoList from '../components/videoList';
import VideoAPI from '../services/videoAPI';

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([VideoAPI.list(), VideoAPI.active()])
            .then(([list, active]) => {
                if (Array.isArray(list)) setVideos(list);
                if (active && active.id) setActiveVideoId(active.id);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleUploaded = (created) => {
        if (!created) return;
        setVideos(prev => {
            const exists = prev.some(v => v.id === created.id);
            return exists
                ? prev.map(v => v.id === created.id ? created : v)
                : [created, ...prev];
        });
    };

    return (
        <div
            className="col-12 col-sm-11 col-md-9 col-xl-9 bg-light py-3"
            style={{background: 'var(--bs-body-bg)'}}
        >
            <div className="row">
                <div className="col">
                    <h4>Upload video</h4>
                    <VideoUploader onUploaded={handleUploaded}/>
                </div>
            </div>
            <div className="row" style={{marginTop: '20px'}}>
                <div className="col">
                    <h4>Videos</h4>
                    {loading
                        ? <div>Loading...</div>
                        : <VideoList
                            videos={videos}
                            setVideos={setVideos}
                            activeVideoId={activeVideoId}
                            onActivated={setActiveVideoId}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

export default Videos;
