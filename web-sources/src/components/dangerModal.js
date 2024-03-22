import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const DangerModal = ({
                         removeModalShow,
                         setRemoveModalShow,
                         submitEventHandler,
                         closeEventHandler,
                         headerName,
                         bodyText,
                         submitButtonName,
                     }) => {
    const closeAndCallParent = () => {
        setRemoveModalShow(false);
        closeEventHandler();
    };

    const submitAndCallParent = () => {
        setRemoveModalShow(false);
        submitEventHandler();
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!removeModalShow) return;

            switch (event.key) {
                case "Escape":
                    closeAndCallParent();
                    break;
                case "Enter":
                    submitAndCallParent();
                    break;
                default:
                    break;
            }
        };

        // Добавляем обработчик событий к window, когда компонент монтируется
        window.addEventListener("keydown", handleKeyDown);

        // Удаляем обработчик событий, когда компонент будет размонтирован
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [removeModalShow, closeAndCallParent, submitAndCallParent]);

    return (
        <Modal show={removeModalShow} onHide={closeAndCallParent} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>{headerName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{bodyText}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeAndCallParent}>
                    Close
                </Button>
                <Button variant="outline-danger" onClick={submitAndCallParent}>
                    {submitButtonName}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DangerModal;
