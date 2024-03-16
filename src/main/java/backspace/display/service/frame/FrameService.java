package backspace.display.service.frame;

import backspace.display.field.Frame;
import backspace.display.field.display.Display;
import backspace.display.service.repo.Repository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FrameService {


    private final Repository<FrameDbDto> frameRepository;
    private final Display display;

    public FrameService(Repository<FrameDbDto> frameRepository, @Qualifier("frameDisplay") Display display) {
        this.frameRepository = frameRepository;
        this.display = display;
    }


    public Frame createFrame(FrameCreationRequest frameCreationRequest) {
        Frame frame = new Frame(frameCreationRequest.getName(), frameCreationRequest.getDescription(), frameCreationRequest.getFrameBytes());
        return saveFrame(frame);
    }

    public Frame createFrame(FrameCreationRequest frameCreationRequest, boolean activate) {
        Frame frame = createFrame(frameCreationRequest);
        if (activate)
            setActiveFrameById(frame.getId());
        return frame;
    }


    public void setActiveFrameById(String frameId) {
        Frame frame = getFrameById(frameId);
        setActiveFrame(frame);
    }

    private void setActiveFrame(Frame frame) {
        display.activate();
        display.setFrame(frame);
    }

    public Frame saveFrame(Frame frame) {
        if (frame.getId() == null)
            frame.setId(UUID.randomUUID().toString());
        FrameDbDto frameDbDto = frameRepository.add(FrameToDbDtoMapper.frameToDbDtoConverter(frame));
        return FrameToDbDtoMapper.dbDtoToFrameConverter(frameDbDto);
    }

    public Frame getFrameById(String frameId) {
        FrameDbDto frameDbDto = frameRepository.getById(frameId);
        return FrameToDbDtoMapper.dbDtoToFrameConverter(frameDbDto);
    }

    public Frame getActiveFrame() {
        return display.getFrame();
    }

    public List<Frame> getAllFrames() {
        List<FrameDbDto> frameDbDtos = frameRepository.getAll();
        return frameDbDtos.stream()
                .map(FrameToDbDtoMapper::dbDtoToFrameConverter)
                .toList();
    }

    public Frame updateFrame(String frameId, FrameCreationRequest frameCreationRequest) {
        Frame frame = getFrameById(frameId);
        frame.setName(frameCreationRequest.getName());
        frame.setDescription(frameCreationRequest.getDescription());
        frame.setPixelsBrightnesses(frameCreationRequest.getFrameBytes());
        Frame newFrame = saveFrame(frame);
        if (display.getFrame().getId().equals(frameId))
            setActiveFrame(newFrame);
        return newFrame;
    }

    public void deleteFrame(String frameId) {
        frameRepository.removeById(frameId);
    }


}
