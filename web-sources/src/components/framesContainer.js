import React, {useState} from "react";
import FrameCard from "./frameCard";
import FramesAPI from "../services/framesAPI";
import DangerModal from "./dangerModal";


const FramesContainer = ({editEventHandler, frames, setFrames}) => {

    const [offset, setOffset] = React.useState(0);
    const [limit, setLimit] = React.useState(100);
    const [filter, setFilter] = React.useState("");

    const [removeModalShow, setRemoveModalShow] = useState(false);
    const [removingFrameId, setRemovingFrameId] = React.useState(null);

    React.useEffect(() => {
        FramesAPI.getAll(offset, limit, filter)
            .then(response => {
                setFrames(response);
            });
    }, []);

    const onRemoveButtonClick = (id) => {
        setRemovingFrameId(id);
        setRemoveModalShow(true);
    }

    const onRemovalConfirmed = () => {
        FramesAPI.remove(removingFrameId)
            .then(() => {
                setFrames(frames.filter(frame => frame.id !== removingFrameId));
            })
            .catch((error) => {
                console.error("Error removing frame: " + error);
            });
    }

    const getFrameById = (id) => {
        return frames.find(frame => frame.id === id);
    }

    return (
        <div>
            <DangerModal
                submitEventHandler={onRemovalConfirmed}
                closeEventHandler={() => {}}
                headerName={`Remove frame ${getFrameById(removingFrameId)?.name}?`}
                bodyText={`Are you sure you want to remove frame "${getFrameById(removingFrameId)?.name}"?`}
                submitButtonName="Remove"
                removeModalShow={removeModalShow}
                setRemoveModalShow={setRemoveModalShow}
            />
            <div className={"card-group"}>
                {frames.map(item => (
                    <li style={{width: '27rem'}}>
                        <FrameCard
                            id={item.id}
                            title={item.name}
                            description={item.description}
                            grid={item.gridBrightnesses}
                            editEventHandler={editEventHandler}
                            removeEventHandler={() => {onRemoveButtonClick(item.id)}}
                        />
                    </li>
                ))}
            </div>
        </div>
    );

}

export default FramesContainer;