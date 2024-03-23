import React, {useState} from "react";
import FrameEditor from "../components/frameEditor";
import FramesContainer from "../components/framesContainer";
import getRandomName from "../hooks/randomNameGenerator";
import DisplayAPI from "../services/displayAPI";

const Frames = () => {
    const width = 40;
    const height = 32;
    const createInitialGridData = () => Array.from({ length: height }, () => Array.from({ length: width }, () => 0));

    const [gridData, setGridData] = useState(createInitialGridData());
    const [frameName, setFrameName] = useState(getRandomName());
    const [frameId, setFrameId] = useState(null);
    const [frames, setFrames] = React.useState([]);
    const [activeFrame, setActiveFrame] = React.useState(null);

    React.useEffect(() => {
        DisplayAPI.state().then(data => {
            setActiveFrame(data);
        });
    }, []);

    const editEventHandler = (id, title, description, grid) => {
        setFrameName(title);
        setGridData(grid);
        setFrameId(id);
    }

    const addFrameToContainerIfNotExists = (frame) => {
        const frameIndex = frames.findIndex(f => f.id === frame.id);
        if (frameIndex === -1) {
            setFrames([...frames, frame]);
        } else {
            const newFrames = [...frames];
            newFrames[frameIndex] = frame;
            setFrames(newFrames);
        }
    }

    const editorFrameSaveEventHandler = (frame) => {
        addFrameToContainerIfNotExists(frame);
    }

    return (
        <div
            className="col-12 col-sm-11 col-md-9 col-xl-9 bg-light py-3"
            style={{
                background: 'var(--bs-body-bg)'
            }}
        >

            <div className="row">
                <FrameEditor enableSaving={true}
                            gridData={gridData}
                            setGridData={setGridData}
                            frameName={frameName}
                            setFrameName={setFrameName}
                             width={width}
                             height={height}
                             frameId={frameId}
                             setFrameId={setFrameId}
                             onSave={frame => {editorFrameSaveEventHandler(frame)}}
                             activeFrameId={activeFrame?.id}
                             setActiveFrameId={id => {setActiveFrame(id)}}

                />
            </div>
            <div
                className="row"
                style={{
                    marginTop: '25px'
                }}

            >

                <FramesContainer

                    editEventHandler={editEventHandler}
                    frames={frames}
                    setFrames={setFrames}

                />
            </div>
        </div>
    );
}

export default Frames;
