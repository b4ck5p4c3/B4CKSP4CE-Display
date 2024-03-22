package backspace.display.service.frame;

import backspace.display.field.Frame;
import backspace.display.field.display.Display;
import backspace.display.service.repo.Repository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@Log4j2
public class FrameService {


    private final Repository<FrameDbDto> frameRepository;
    private final Display display;

    public FrameService(Repository<FrameDbDto> frameRepository, @Qualifier("frameDisplay") Display display) {
        this.frameRepository = frameRepository;
        this.display = display;
    }


    public Frame createFrame(FrameCreationRequest frameCreationRequest) {
        Frame frame = new Frame(frameCreationRequest.getName(), frameCreationRequest.getDescription(), frameCreationRequest.getFrameBytes());
        Frame savedFrame = saveFrame(frame);
        log.info("Created frame with id: {}", savedFrame.getId());
        return savedFrame;
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
        Objects.requireNonNull(frameId, "Frame id cannot be null");
        Objects.requireNonNull(frameCreationRequest, "Frame creation request cannot be null");
        Frame frame = getFrameById(frameId);
        frame.setName(frameCreationRequest.getName());
        frame.setDescription(frameCreationRequest.getDescription());
        frame.setPixelsBrightnesses(frameCreationRequest.getFrameBytes());
        Frame newFrame = saveFrame(frame);
        log.info("Updated frame with id: {}", newFrame.getId());
        final Frame activeFrame = display.getFrame();
        if (activeFrame != null && activeFrame.getId() != null && display.getFrame().getId().equals(frameId))
            setActiveFrame(newFrame);
        return newFrame;
    }

    public void deleteFrame(String frameId) {
        frameRepository.removeById(frameId);
    }


}
