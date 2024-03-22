import React from 'react';
import {faBraille, faCode, faHome} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Sidebar = () => (
    <nav className="navbar navbar-expand-sm bg-dark text-nowrap flex-row align-items-start flex-sm-column navbar-dark">
        <div className="container flex-sm-column">
            <a className="navbar-brand" href="#">
                <FontAwesomeIcon icon={faBraille} size={"2x"} color={"#ffc107"} />
            </a>
            <button
                className="navbar-toggler"
                data-bs-toggle="collapse"
                data-bs-target="#navcol-1"
            >
                <span className="visually-hidden">Toggle navigation</span>
                <span className="navbar-toggler-icon" />
            </button>
            <div id="navcol-1" className="collapse navbar-collapse">
                <ul className="navbar-nav flex-column justify-content-between w-100">
                    <li
                        className="nav-item"
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Overview"
                    >
                        <a className="nav-link" href="/">
                            <FontAwesomeIcon icon={faHome} size={"sm"}/>
                            <span className="d-inline-block d-sm-none d-md-inline-block ms-1">
                Frames
              </span>
                        </a>
                    </li>
                    <li
                        className="nav-item"
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Properties"
                        hidden=""
                    >
                        <a className="nav-link" href="/scripts">
                            <FontAwesomeIcon icon={faCode} size={"sm"}/>
                            <span className="d-inline-block d-sm-none d-md-inline-block ms-1">
                Scripts
              </span>
                        </a>
                    </li>
              {/*      <li*/}
              {/*          className="nav-item"*/}
              {/*          data-bs-toggle="tooltip"*/}
              {/*          data-bs-placement="right"*/}
              {/*          title="Properties"*/}
              {/*      >*/}
              {/*          <a className="nav-link" href="bricknballs">*/}
              {/*              <FontAwesomeIcon icon={faCircle} size={"sm"}/>*/}
              {/*              <span className="d-inline-block d-sm-none d-md-inline-block ms-2">*/}
              {/*  Bricks*/}
              {/*</span>*/}
              {/*          </a>*/}
              {/*      </li>*/}
              {/*      <li*/}
              {/*          className="nav-item"*/}
              {/*          data-bs-toggle="tooltip"*/}
              {/*          data-bs-placement="right"*/}
              {/*          title="Properties"*/}
              {/*      >*/}
              {/*          <a className="nav-link" href="snake">*/}
              {/*              <FontAwesomeIcon icon={faEllipsisV} size={"sm"} style={{ paddingLeft: 5 }}/>*/}

              {/*              <span*/}
              {/*                  className="d-inline-block d-sm-none d-md-inline-block ms-2"*/}
              {/*                  style={{ paddingLeft: 5 }}*/}
              {/*              >*/}
              {/*  Snake*/}
              {/*</span>*/}
              {/*          </a>*/}
              {/*      </li>*/}
                </ul>
            </div>
        </div>
    </nav>
);

export default Sidebar;
