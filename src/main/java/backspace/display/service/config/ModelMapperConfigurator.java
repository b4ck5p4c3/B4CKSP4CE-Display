package backspace.display.service.config;

import backspace.display.api.rest.frame.FrameCreationRequestDto;
import backspace.display.api.rest.frame.FrameDto;
import backspace.display.api.websocket.LiveFrameUpdateRequestBase64;
import backspace.display.field.Frame;
import backspace.display.service.ByteBase64MappingUtils;
import backspace.display.service.FrameCreationRequest;
import backspace.display.service.LiveFrameUpdateRequest;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class ModelMapperConfigurator {


    private Converter<List<String>, byte[][]> base64ToBytesListConverter() {
        return context -> ByteBase64MappingUtils.base64ToBytesListConverter(context.getSource());
    }

    private Converter<byte[][], List<String>> bytesToBase64() {
        return context -> ByteBase64MappingUtils.bytesListToBase64Converter(context.getSource());
    }

    private void frameCreationRequestMapper(ModelMapper modelMapper) {
        TypeMap<FrameCreationRequestDto, FrameCreationRequest> typeMap =
                modelMapper.createTypeMap(FrameCreationRequestDto.class, FrameCreationRequest.class);
        typeMap.addMappings(mapper -> mapper.using(base64ToBytesListConverter())
                .map(FrameCreationRequestDto::getPixelsBrightnesses, FrameCreationRequest::setFrameBytes));
    }

    private void frameToDtoMapper(ModelMapper modelMapper) {
        TypeMap<Frame, FrameDto> typeMap =
                modelMapper.createTypeMap(Frame.class, FrameDto.class);
        typeMap.addMappings(mapper -> mapper.using(bytesToBase64())
                .map(Frame::getPixelsBrightnesses, FrameDto::setPixelsBrightnesses));
    }

    private void fieldUpdateDataMapper(ModelMapper modelMapper) {
        TypeMap<LiveFrameUpdateRequestBase64, LiveFrameUpdateRequest> typeMap =
                modelMapper.createTypeMap(LiveFrameUpdateRequestBase64.class, LiveFrameUpdateRequest.class);
        typeMap.addMappings(mapper -> mapper.using(base64ToBytesListConverter())
                .map(LiveFrameUpdateRequestBase64::getPixelsBrightnesses, LiveFrameUpdateRequest::setPixelsBrightnesses));
    }


    @Bean
    public ModelMapper createModelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        frameCreationRequestMapper(modelMapper);
        frameToDtoMapper(modelMapper);
        fieldUpdateDataMapper(modelMapper);
        return modelMapper;
    }


}
