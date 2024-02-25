package backspace.display.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

public class ByteBase64MappingUtils {
    private final static Base64.Decoder base64Decoder = Base64.getDecoder();
    private final static Base64.Encoder base64Encoder = Base64.getEncoder();
    public static List<String> bytesListToBase64Converter(byte[][] bytesList) {
        List<String> base64List = new ArrayList<>();
        for (byte[] bytes : bytesList) {
            base64List.add(base64Encoder.encodeToString(bytes));
        }
        return base64List;
    }

    public static byte[][] base64ToBytesListConverter(List<String> base64List) {
        byte[][] bytesList = new byte[base64List.size()][];
        for (int i = 0; i < base64List.size(); i++) {
            bytesList[i] = base64Decoder.decode(base64List.get(i));
        }
        return bytesList;
    }
}
