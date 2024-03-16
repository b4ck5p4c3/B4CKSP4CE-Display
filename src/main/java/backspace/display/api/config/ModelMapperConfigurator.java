package backspace.display.api.config;

import backspace.display.api.rest.frame.FrameCreationRequestDto;
import backspace.display.api.rest.frame.FrameDto;
import backspace.display.api.rest.scripts.ScriptCreationRequestDto;
import backspace.display.api.rest.scripts.ScriptDto;
import backspace.display.api.websocket.live.LiveFrameUpdateRequestBase64;
import backspace.display.field.Frame;
import backspace.display.script.Script;
import backspace.display.service.ByteBase64MappingUtils;
import backspace.display.service.frame.FrameCreationRequest;
import backspace.display.service.live.LiveFrameUpdateRequest;
import backspace.display.service.script.ScriptCreationRequest;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Configuration;

import java.util.Base64;
import java.util.List;

@Configuration
@AllArgsConstructor
public class ModelMapperConfigurator {

    private final ModelMapper modelMapper;

    private Converter<List<String>, byte[][]> base64ToBytesListConverter() {
        return context -> ByteBase64MappingUtils.base64ToBytesListConverter(context.getSource());
    }

    private Converter<byte[][], List<String>> bytesToBase64() {
        return context -> ByteBase64MappingUtils.bytesListToBase64Converter(context.getSource());
    }

    @PostConstruct
    private void frameCreationRequestMapper() {
        TypeMap<FrameCreationRequestDto, FrameCreationRequest> typeMap =
                modelMapper.createTypeMap(FrameCreationRequestDto.class, FrameCreationRequest.class);
        typeMap.addMappings(mapper -> mapper.using(base64ToBytesListConverter())
                .map(FrameCreationRequestDto::getPixelsBrightnesses, FrameCreationRequest::setFrameBytes));
    }

    @PostConstruct
    private void frameToDtoMapper() {
        TypeMap<Frame, FrameDto> typeMap =
                modelMapper.createTypeMap(Frame.class, FrameDto.class);
        typeMap.addMappings(mapper -> mapper.using(bytesToBase64())
                .map(Frame::getPixelsBrightnesses, FrameDto::setPixelsBrightnesses));
    }

    @PostConstruct
    private void fieldUpdateDataMapper() {
        TypeMap<LiveFrameUpdateRequestBase64, LiveFrameUpdateRequest> typeMap =
                modelMapper.createTypeMap(LiveFrameUpdateRequestBase64.class, LiveFrameUpdateRequest.class);
        typeMap.addMappings(mapper -> mapper.using(base64ToBytesListConverter())
                .map(LiveFrameUpdateRequestBase64::getPixelsBrightnesses, LiveFrameUpdateRequest::setPixelsBrightnesses));
    }

    @PostConstruct
    private void ScriptCreationRequestDtoToModel() {
        final Base64.Decoder decoder = Base64.getDecoder();
        TypeMap<ScriptCreationRequestDto, ScriptCreationRequest> typeMap =
                modelMapper.createTypeMap(ScriptCreationRequestDto.class, ScriptCreationRequest.class);
        typeMap.addMappings(mapper -> mapper.using(context ->
                        context.getSource())
                .map(ScriptCreationRequestDto::getScript, ScriptCreationRequest::setScript));
    }


    @PostConstruct
    private void ScriptModelToDtoMapper() {
        TypeMap<Script, ScriptDto> typeMap =
                modelMapper.createTypeMap(Script.class, ScriptDto.class);
        typeMap.addMappings(mapper -> mapper.using(context ->
                        context.getSource())
                .map(Script::getScript, ScriptDto::setScript));
    }


}
