import React from "react";
import Grid from "./grid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlay, faTrash} from "@fortawesome/free-solid-svg-icons";
import FramesAPI from "../services/framesAPI";


const FrameCard = ({id, title, description, grid, editEventHandler, removeEventHandler}) => {

    const playEventHandler = () => {
        FramesAPI.activate(id);
    }



    return (

        <div className="card m-3">
            <div className="card-header text-center ">

                <button type="button" className="btn btn-success playButton mx-1"
                        onClick={playEventHandler}>
                    <FontAwesomeIcon icon={faPlay} />
                </button>
                <button type="button" className="btn btn-outline-primary editButton mx-1"
                        onClick={() => {editEventHandler(id, title, description, grid)}}
                >
                    <FontAwesomeIcon icon={faPencil} />
                </button>
                <button type="button" className="btn btn-outline-danger removeButton mx-1"
                onClick={removeEventHandler}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
            <Grid grid={grid} onClick={(a,b) => {}} cellSize={13} gapSize={2}/>
            <div className="card-body">
                <h5 className="card-title">
                    {title}
                </h5>
                <p className="card-text" >
                    {description}
                </p>
            </div>
            <div className="card-body"></div>
        </div>

    );
}

export default FrameCard;