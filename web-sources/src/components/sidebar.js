import React from 'react';

const Sidebar = () => (
    <nav class="navbar navbar-expand-sm bg-dark text-nowrap flex-row align-items-start flex-sm-column navbar-dark">
        <div class="container flex-sm-column"><a class="navbar-brand" href="#"><i class="fa fa-braille fa-2x text-warning"></i></a><button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
            <div id="navcol-1" class="collapse navbar-collapse">
                <ul class="navbar-nav flex-column justify-content-between w-100">
                    <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Overview"><a class="nav-link" href="/index.html"><i class="fa fa-home me-2 text-info"></i><span class="d-inline-block d-sm-none d-md-inline-block">Frames</span></a></li>
                    <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Properties" hidden><a class="nav-link" href="#"><i class="fa fa-gear me-2 text-info"></i><span class="d-inline-block d-sm-none d-md-inline-block">Props</span></a></li>
                    <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Properties"><a class="nav-link" href="bricknballs.html"><i class="fa fa-circle me-2 text-info"></i><span class="d-inline-block d-sm-none d-md-inline-block">Bricks</span></a></li>
                    <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="right" title="Properties"><a class="nav-link" href="snake.html"><i class="fa fa-ellipsis-v me-2 text-info" style="padding-left: 5px;"></i><span class="d-inline-block d-sm-none d-md-inline-block" style="padding-left: 5px;">Snake</span></a></li>
                </ul>
            </div>
        </div>
    </nav>
);

export default Sidebar;
