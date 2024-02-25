package backspace.display.service.repo.frame;

import backspace.display.field.Frame;

import java.util.Base64;

import static backspace.display.service.ByteBase64MappingUtils.base64ToBytesListConverter;
import static backspace.display.service.ByteBase64MappingUtils.bytesListToBase64Converter;


public class FrameToDbDtoMapper {

    private final static Base64.Encoder base64Encoder = Base64.getEncoder();
    private final static Base64.Decoder base64Decoder = Base64.getDecoder();


    public static FrameDbDto frameToDbDtoConverter(Frame frame) {
        FrameDbDto frameDbDto = new FrameDbDto();
        frameDbDto.setId(frame.getId());
        frameDbDto.setName(frame.getName());
        frameDbDto.setDescription(frame.getDescription());
        frameDbDto.setPixelsBrightnesses(bytesListToBase64Converter(frame.getPixelsBrightnesses()));
        return frameDbDto;
    }

    public static Frame dbDtoToFrameConverter(FrameDbDto frameDbDto) {
        Frame frame = new Frame(base64ToBytesListConverter(frameDbDto.getPixelsBrightnesses()));
        frame.setId(frameDbDto.getId());
        frame.setName(frameDbDto.getName());
        frame.setDescription(frameDbDto.getDescription());
        return frame;
    }


}
